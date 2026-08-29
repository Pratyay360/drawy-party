import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { BinaryFiles } from "@excalidraw/excalidraw/types";
import PartySocket from "partysocket";
import YPartyKitProvider from "y-partykit/provider";
import * as Y from "yjs";
import { SINGLETON_ROOM_ID } from "../party/rooms";

export interface ScenePayload {
	elements: readonly ExcalidrawElement[];
	files?: BinaryFiles;
}

export function mergeElements(
	local: readonly ExcalidrawElement[],
	remote: readonly ExcalidrawElement[],
): ExcalidrawElement[] {
	if (!remote || remote.length === 0) return [...local];
	const byId = new Map<string, ExcalidrawElement>();
	for (const el of local) byId.set(el.id, el);
	for (const r of remote) {
		const existing = byId.get(r.id);
		if (!existing || (r.version ?? 0) >= (existing.version ?? 0))
			byId.set(r.id, r);
	}
	return [...byId.values()];
}

type SceneCb = (payload: ScenePayload) => void;
type SavedCb = () => void;
type PresenceCb = (count: number) => void;

export class CanvasRealtime {
	private socket: PartySocket | undefined;
	private ydoc: Y.Doc | undefined;
	private provider: YPartyKitProvider | undefined;
	private presenceSocket: PartySocket | undefined;
	private sceneCbs = new Set<SceneCb>();
	private savedCbs = new Set<SavedCb>();
	private presenceCbs = new Set<PresenceCb>();
	private lastRooms: Record<string, number> = {};
	private sceneTimer: ReturnType<typeof setTimeout> | null = null;
	private pendingScene: ScenePayload | null = null;

	constructor(
		private readonly canvasId: string,
		private readonly username: string = "Anonymous",
	) {}

	connect() {
		if (this.socket) return;
		const socket = new PartySocket({
			host: import.meta.env.VITE_PARTYKIT_HOST!,
			party: "main",
			room: this.canvasId,
		});
		socket.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				if (data.type === "scene")
					this.sceneCbs.forEach((fn) => fn(data?.payload));
				else if (data.type === "saved") this.savedCbs.forEach((fn) => fn());
			} catch {}
		};
		this.socket = socket;

		const ydoc = new Y.Doc();
		const provider = new YPartyKitProvider(
			import.meta.env.VITE_PARTYKIT_HOST!,
			this.canvasId,
			ydoc,
			{
				party: "main",
			} as unknown as ConstructorParameters<typeof YPartyKitProvider>[3],
		);
		const awareness = provider.awareness;
		awareness.setLocalStateField("user", {
			name: this.username,
			color: `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`,
		});
		const onAwareness = () => {
			const count = awareness.getStates().size;
			this.presenceCbs.forEach((fn) => fn(count));
		};
		awareness.on("change", onAwareness);
		setTimeout(onAwareness, 300);

		this.ydoc = ydoc;
		this.provider = provider;

		// 3) rooms singleton fallback
		const pSocket = new PartySocket({
			host: import.meta.env.VITE_PARTYKIT_HOST!,
			party: "rooms",
			room: SINGLETON_ROOM_ID,
		});
		pSocket.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				if (data.type === "rooms" && data.rooms) {
					this.lastRooms = data.rooms;
					if (awareness.getStates().size <= 1) {
						const count = data.rooms[this.canvasId] ?? 0;
						this.presenceCbs.forEach((fn) => fn(count));
					}
				}
			} catch {}
		};
		this.presenceSocket = pSocket;
	}

	getAwareness() {
		return this.provider?.awareness;
	}
	getYDoc() {
		return this.ydoc;
	}
	getProvider() {
		return this.provider;
	}

	broadcastScene(elements: readonly ExcalidrawElement[], files?: BinaryFiles) {
		if (!this.socket) return;
		this.pendingScene = {
			elements,
			files: files && Object.keys(files).length > 0 ? files : undefined,
		};
		if (this.sceneTimer) return;
		this.sceneTimer = setTimeout(() => {
			this.sceneTimer = null;
			const payload = this.pendingScene;
			this.pendingScene = null;
			if (payload && this.socket)
				this.socket.send(JSON.stringify({ type: "scene", payload }));
		}, 250);
	}

	broadcastSaved() {
		if (this.socket)
			this.socket.send(JSON.stringify({ type: "saved", payload: {} }));
	}

	onScene(cb: SceneCb): () => void {
		this.sceneCbs.add(cb);
		return () => this.sceneCbs.delete(cb);
	}
	onSaved(cb: SavedCb): () => void {
		this.savedCbs.add(cb);
		return () => this.savedCbs.delete(cb);
	}
	onPresence(cb: PresenceCb): () => void {
		this.presenceCbs.add(cb);
		const cnt = this.provider?.awareness.getStates().size;
		if (cnt !== undefined && cnt > 0) cb(cnt);
		else if (Object.keys(this.lastRooms).length > 0)
			cb(this.lastRooms[this.canvasId] ?? 0);
		return () => this.presenceCbs.delete(cb);
	}

	disconnect() {
		if (this.sceneTimer) {
			clearTimeout(this.sceneTimer);
			this.sceneTimer = null;
		}
		this.socket?.close();
		this.socket = undefined;
		this.provider?.destroy();
		this.ydoc?.destroy();
		this.presenceSocket?.close();
		this.ydoc = undefined;
		this.provider = undefined;
		this.presenceSocket = undefined;
		this.sceneCbs.clear();
		this.savedCbs.clear();
		this.presenceCbs.clear();
	}
}

let globalSocket: PartySocket | null = null;
const globalListeners = new Set<() => void>();
const pendingGlobalMessages: string[] = [];

function ensureGlobalSocket(): PartySocket | null {
	if (typeof window === "undefined") return null;
	if (globalSocket) return globalSocket;
	const socket = new PartySocket({
		host: import.meta.env.VITE_PARTYKIT_HOST!,
		party: "rooms",
		room: SINGLETON_ROOM_ID,
	});
	socket.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data);
			if (data.type === "canvas-list-changed")
				globalListeners.forEach((fn) => fn());
		} catch {}
	};
	socket.onopen = () => {
		while (pendingGlobalMessages.length > 0)
			socket.send(pendingGlobalMessages?.shift);
	};
	globalSocket = socket;
	return socket;
}

export function publishCanvasListChanged() {
	const socket = ensureGlobalSocket();
	const msg = JSON.stringify({ type: "canvas-list-changed" });
	if (socket?.readyState === WebSocket.OPEN) socket.send(msg);
	else pendingGlobalMessages.push(msg);
}

export function subscribeCanvasListChanged(cb: () => void): () => void {
	ensureGlobalSocket();
	globalListeners.add(cb);
	return () => globalListeners.delete(cb);
}
