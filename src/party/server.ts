import * as decoding from "lib0/decoding";
import * as encoding from "lib0/encoding";
import type * as Party from "partykit/server";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import * as Y from "yjs";

// Ephemeral Yjs server — no persistence.
// Previous version used y-partykit with `persist:true` and stored huge
// Excalidraw scene blobs as Yjs updates, which produced truncated
// chunks (128KB splits) that decode as "Unexpected end of array".
// Fix: never persist, clear old storage, keep doc only in memory.

const messageSync = 0;
const messageAwareness = 1;
const BATCH_SENTINEL = "y-pk-batch";

// y-partykit client chunks large messages with batch sentinels.
// Re-implement the receiver side so large sync won't break.
function createChunkedHandler(receive: (data: Uint8Array) => void) {
	let batch: ArrayBuffer[] | undefined;
	let start: { id: string; count: number; size: number } | undefined;
	return (message: { data: unknown }) => {
		if (typeof message.data === "string") {
			if ((message.data as string).startsWith(BATCH_SENTINEL)) {
				const raw = message.data as string;
				const idx = raw.indexOf("#");
				const json = raw.slice(idx + 1);
				try {
					const marker = JSON.parse(json) as {
						type: "start" | "end";
						id: string;
						count: number;
						size: number;
					};
					if (marker.type === "start") {
						batch = [];
						start = marker;
					} else if (marker.type === "end" && batch) {
						const size = batch.reduce((s, b) => s + b.byteLength, 0);
						const bytes = new Uint8Array(size);
						let off = 0;
						for (const c of batch) {
							bytes.set(new Uint8Array(c), off);
							off += c.byteLength;
						}
						if (
							start &&
							start.id === marker.id &&
							start.count === batch.length &&
							start.size === size
						) {
							try {
								receive(bytes);
							} catch (e) {
								console.error("[drawy] chunked receive error", e);
							}
						} else {
							console.warn("[drawy] chunked batch mismatch", {
								start,
								marker,
								batchLen: batch.length,
								size,
							});
						}
						batch = undefined;
						start = undefined;
					}
				} catch (e) {
					console.error("[drawy] bad batch marker", e);
					batch = undefined;
					start = undefined;
				}
			}
			return;
		}
		if (batch) {
			batch.push(message.data as ArrayBuffer);
		} else if (
			message.data instanceof ArrayBuffer ||
			message.data instanceof Uint8Array ||
			ArrayBuffer.isView(message.data)
		) {
			const buf = message.data as ArrayBuffer;
			// decoding expects Uint8Array
			receive(new Uint8Array(buf));
		} else if (typeof message.data !== "string") {
			// fallback
			try {
				receive(new Uint8Array(message.data as ArrayBuffer));
			} catch {}
		}
	};
}

export default class EditorServer implements Party.Server {
	doc: Y.Doc | null = null;
	awareness: awarenessProtocol.Awareness | null = null;
	conns = new Map<Party.Connection, Set<number>>();

	constructor(public room: Party.Room) {}

	async onConnect(conn: Party.Connection) {
		// One-time cleanup of corrupted persisted Yjs chunks from old y-partykit
		// storage format (keys like "v1#<roomId>#update#..."). Old code checked
		// room.storage.get(room.id) which never matches chunked keys, so corruption
		// was never cleared. Delete everything lazily.
		try {
			const hasAny = [...(await this.room.storage.list())].length > 0;
			if (hasAny) {
				// Old persisted doc is useless — presence only. Wipe it.
				await this.room.storage.deleteAll();
			}
		} catch (e) {
			console.warn("[drawy] storage cleanup failed", e);
		}

		if (!this.doc || !this.awareness) {
			const doc = new Y.Doc({ gc: true });
			const awareness = new awarenessProtocol.Awareness(doc);
			awareness.setLocalState(null);

			awareness.on(
				"update",
				(
					{
						added,
						updated,
						removed,
					}: { added: number[]; updated: number[]; removed: number[] },
					origin: unknown,
				) => {
					const connOrigin = origin as Party.Connection | null;
					const changed = [...added, ...updated, ...removed];
					if (connOrigin !== null) {
						const controlled = this.conns.get(connOrigin);
						if (controlled) {
							added.forEach((id) => controlled.add(id));
							removed.forEach((id) => controlled.delete(id));
						}
					}
					const encoder = encoding.createEncoder();
					encoding.writeVarUint(encoder, messageAwareness);
					encoding.writeVarUint8Array(
						encoder,
						awarenessProtocol.encodeAwarenessUpdate(awareness, changed),
					);
					const bytes = encoding.toUint8Array(encoder);
					for (const [c] of this.conns) {
						try {
							c.send(bytes);
						} catch {}
					}
				},
			);

			doc.on("update", (update: Uint8Array, origin: unknown) => {
				// Broadcast Yjs document updates to all peers except origin
				this.broadcastUpdate(update, origin);
			});

			this.doc = doc;
			this.awareness = awareness;
		}

		this.conns.set(conn, new Set());

		// y-partykit chunks large websocket frames with sentinel strings.
		const handleYjsBinary = createChunkedHandler((bytes: Uint8Array) => {
			try {
				this.handleYjsMessage(conn, bytes);
			} catch (err) {
				console.error("[drawy] handleYjsMessage error", err);
				// Don't crash the DO on corrupted client update — just drop it.
				if (
					err instanceof Error &&
					err.message.includes("Unexpected end of array")
				) {
					console.warn("[drawy] dropping corrupted Yjs update from", conn.id);
				}
			}
		});

		// Attach raw binary listener — PartyKit delivers both via onMessage and via
		// addEventListener. We use addEventListener for chunked frames.
		(
			conn as unknown as {
				addEventListener: (t: string, h: (e: unknown) => void) => void;
			}
		).addEventListener("message", (evt: unknown) => {
			const data = (evt as { data?: unknown })?.data;
			// Only handle binary/Uint8Array here; string messages fall through to onMessage
			if (typeof data === "string") {
				if ((data as string).startsWith(BATCH_SENTINEL))
					handleYjsBinary({ data } as { data: unknown });
				return;
			}
			handleYjsBinary({ data } as { data: unknown });
		});

		// Send sync step 1 + current awareness
		try {
			const encoder = encoding.createEncoder();
			encoding.writeVarUint(encoder, messageSync);
			syncProtocol.writeSyncStep1(encoder, this.doc);
			conn.send(encoding.toUint8Array(encoder));

			if (this.awareness.getStates().size > 0) {
				const enc2 = encoding.createEncoder();
				encoding.writeVarUint(enc2, messageAwareness);
				encoding.writeVarUint8Array(
					enc2,
					awarenessProtocol.encodeAwarenessUpdate(
						this.awareness,
						Array.from(this.awareness.getStates().keys()),
					),
				);
				conn.send(encoding.toUint8Array(enc2));
			}
		} catch (e) {
			console.error("[drawy] initial sync failed", e);
		}
	}

	private handleYjsMessage(conn: Party.Connection, bytes: Uint8Array) {
		if (!this.doc || !this.awareness) return;
		const decoder = decoding.createDecoder(bytes);
		const messageType = decoding.readVarUint(decoder);
		switch (messageType) {
			case messageSync: {
				const encoder = encoding.createEncoder();
				encoding.writeVarUint(encoder, messageSync);
				// readSyncMessage handles step1/step2/update
				const msgType = decoding.readVarUint(decoder);
				switch (msgType) {
					case syncProtocol.messageYjsSyncStep1:
						syncProtocol.readSyncStep1(decoder, encoder, this.doc);
						break;
					case syncProtocol.messageYjsSyncStep2:
						syncProtocol.readSyncStep2(decoder, this.doc, conn);
						break;
					case syncProtocol.messageYjsUpdate:
						syncProtocol.readUpdate(decoder, this.doc, conn);
						break;
					default:
						throw new Error("Unknown sync message type");
				}
				if (encoding.length(encoder) > 1) {
					conn.send(encoding.toUint8Array(encoder));
				}
				// For updates (step2 / update) the doc's "update" listener would broadcast,
				// but y-partykit's pattern is to send the computed encoder reply only.
				// However we also need to broadcast new updates to other peers:
				// syncProtocol.readUpdate already applied to doc, which triggers
				// our doc.on("update") — but we intentionally don't broadcast there.
				// Instead mirror y-partykit's updateHandler: broadcast update to all conns.
				// To avoid double-send, check if we just processed an update:
				if (
					msgType === syncProtocol.messageYjsUpdate ||
					msgType === syncProtocol.messageYjsSyncStep2
				) {
					// Re-encode the received update for forwarding? The doc already
					// has it. We broadcast the original bytes as an update message
					// to keep it simple: encode as messageSync+update
					// But original bytes already consumed. So we capture fresh.
					// Instead rely on doc.on("update") forwarding below — we handle it manually:
					// The simplest is to forward the update we just applied via readUpdate/readSyncStep2.
					// Those functions already emit doc update; we can broadcast via our handler.
					// For now, broadcast to others using a new encoder with the same update
					// Not easy without capturing update. So we instead broadcast via doc event:
					// We'll trigger broadcast in the doc update listener — but we disabled it above.
					// So do explicit broadcast here: if this was an update, forward to others.
					// We need the raw update bytes — decoding already consumed them.
					// Workaround: after read, encode current state diff? Too heavy.
					// Simpler: enable doc.on("update") forwarding for non-origin.
				}
				break;
			}
			case messageAwareness: {
				const update = decoding.readVarUint8Array(decoder);
				try {
					awarenessProtocol.applyAwarenessUpdate(this.awareness, update, conn);
				} catch (e) {
					if (
						e instanceof Error &&
						e.message.includes("Unexpected end of array")
					) {
						console.warn("[drawy] corrupted awareness update dropped");
						return;
					}
					throw e;
				}
				break;
			}
			default:
				console.warn("[drawy] unknown yjs message type", messageType);
		}
	}

	// Forward Yjs doc updates to other peers (called when doc emits "update")
	private broadcastUpdate(update: Uint8Array, origin: unknown) {
		const encoder = encoding.createEncoder();
		encoding.writeVarUint(encoder, messageSync);
		syncProtocol.writeUpdate(encoder, update);
		const bytes = encoding.toUint8Array(encoder);
		for (const [c] of this.conns) {
			if (c.id === (origin as Party.Connection | null)?.id) continue;
			try {
				c.send(bytes);
			} catch {}
		}
	}

	onClose(conn: Party.Connection) {
		if (this.awareness && this.conns.has(conn)) {
			const controlled = this.conns.get(conn);
			this.conns.delete(conn);
			if (controlled) {
				awarenessProtocol.removeAwarenessStates(
					this.awareness,
					Array.from(controlled),
					null,
				);
			}
		}
		// Keep doc alive for room lifetime (ephemeral). No persistence.
	}

	onMessage(message: string | ArrayBuffer, sender: Party.Connection) {
		// Binary Yjs already handled via addEventListener path. If it arrives here
		// as ArrayBuffer (some runtimes), handle it too.
		if (typeof message !== "string") {
			try {
				const bytes =
					message instanceof Uint8Array
						? message
						: new Uint8Array(message as ArrayBuffer);
				// y-partykit chunks not relevant here, just direct
				this.handleYjsMessage(sender, bytes);
			} catch (err) {
				console.error("[drawy] onMessage binary error", err);
				if (
					err instanceof Error &&
					err.message.includes("Unexpected end of array")
				) {
					// drop corrupted frame, don't crash
				}
			}
			return;
		}
		let data: Record<string, unknown>;
		try {
			data = JSON.parse(message) as Record<string, unknown>;
		} catch {
			return;
		}
		if (
			data["type"] === "scene" ||
			data["type"] === "saved" ||
			data["event"] === "realtime-cursor-move"
		) {
			this.room.broadcast(message, [sender.id]);
		}
	}
}
