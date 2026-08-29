import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";

export default class EditorServer implements Party.Server {
    constructor(public room: Party.Room) {}

    async onConnect(conn: Party.Connection) {
        // Clear any corrupted persisted doc from previous version that stored large scene payloads
        try {
            const maybeCorrupted = await this.room.storage.get(this.room.id);
            if (maybeCorrupted) {
                const cleared = await this.room.storage.get("yjs-cleared-v2");
                if (!cleared) {
                    await this.room.storage.deleteAll();
                    await this.room.storage.put("yjs-cleared-v2", "1");
                }
            }
        } catch {}
        try {
            // Disable persistence for now - presence/cursors only, scene via PartySocket JSON.
            // Prevents future Unexpected end of array from large binary storage.
            return await onConnect(conn, this.room, {
                persist: false,
            } as unknown as Parameters<typeof onConnect>[2]);
        } catch (err) {
            if (err instanceof Error && err.message.includes("Unexpected end of array")) {
                console.error(
                    `[y-partykit] corrupted doc for ${this.room.id}, clearing storage:`,
                    err.message,
                );
                try {
                    await this.room.storage.deleteAll();
                } catch {}
                return await onConnect(conn, this.room, {
                    persist: false,
                } as unknown as Parameters<typeof onConnect>[2]);
            }
            throw err;
        }
    }

    onClose(_conn: Party.Connection) {
        // presence now via yjs awareness, no need to POST to rooms party
        // (previous updateCount caused workerd Network connection lost)
    }

    // y-partykit handles Yjs binary messages via conn.addEventListener in onConnect.
    // Only rebroadcast our JSON app messages; ignore Yjs binary frames.
    onMessage(message: string | ArrayBuffer, sender: Party.Connection) {
        if (typeof message !== "string") return;
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