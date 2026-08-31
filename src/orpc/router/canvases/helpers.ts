import { ORPCError } from "@orpc/server";
import type { Canvas } from "#/lib/db/schema";
import { CanvasAppStateSchema, SharedWithFieldSchema } from "./types";

export function parseCanvasAppState(raw: unknown): { sharedWith: string[] } {
    const parsed = CanvasAppStateSchema.safeParse(raw);
    if (!parsed.success) return { sharedWith: [] };
    const shared = SharedWithFieldSchema.safeParse(parsed.data);
    return shared.success ? shared.data : { sharedWith: [] };
}

export function toMeta(row: Canvas, currentUser?: string) {
    const shared = parseCanvasAppState(row.appState).sharedWith;
    return {
        id: row.id,
        title: row.title,
        createdAt: row.createdAt?.toISOString() ?? "",
        updatedAt: row.updatedAt?.toISOString() ?? "",
        owner: row.userId || "Anonymous",
        isOwner: currentUser ? row.userId === currentUser : false,
        sharedWith: shared,
    };
}

export function toData(row: Canvas, currentUser?: string) {
    const raw = (
        row.appState && typeof row.appState === "object" ? row.appState : {}
    ) as Record<string, unknown>;
    const files = (
        raw.files && typeof raw.files === "object" ? raw.files : {}
    ) as Record<string, unknown>;
    return {
        ...toMeta(row, currentUser),
        elements: row.elements,
        appState: row.appState,
        files,
    };
}

export function fail(error: { message: string }): never {
    throw new ORPCError("INTERNAL_SERVER_ERROR", { message: error.message });
}
