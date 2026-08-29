import type * as Party from "partykit/server";

export const SINGLETON_ROOM_ID = "index";

export default class OccupancyServer implements Party.Server {
    rooms: Record<string, number>;

    constructor(public room: Party.Room) {
        this.rooms = {};
    }

    onConnect(connection: Party.Connection) {
        connection.send(JSON.stringify({ type: "rooms", rooms: this.rooms }));
    }

    onMessage(message: string, sender: Party.Connection) {
        try {
            const data = JSON.parse(message) as { type?: string };
            if (data.type === "canvas-list-changed") {
                this.room.broadcast(message, [sender.id]);
            }
        } catch {}
    }

    async onRequest(req: Party.Request) {
        if (req.method === "POST") {
            const { room, count } = (await req.json()) as {
                room: string;
                count: number;
            };
            this.rooms[room] = count;
            this.room.broadcast(JSON.stringify({ type: "rooms", rooms: this.rooms }));
            return Response.json({ ok: true });
        }
        return Response.json({ error: "Method not allowed" }, { status: 405 });
    }
}