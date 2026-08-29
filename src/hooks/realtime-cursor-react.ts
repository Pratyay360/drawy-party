import { useCallback, useEffect, useState } from "react";
import type { Awareness } from "y-protocols/awareness";
import type * as Y from "yjs";
import { useRealtimeCursorStore } from "#/stores/realtime-cursor";
import { useThrottleCallback } from "./use-throttle-callback";

export type CursorEventPayload = {
    position: { x: number; y: number };
    user: { id: string; name: string };
    color: string;
    timestamp: number;
};

// Now uses Yjs awareness (y-partykit) instead of raw PartySocket.
// Falls back to shared awareness from CanvasRealtime if available.
export const useRealtimeCursors = ({
    roomName,
    username,
    throttleMs,
    ydoc,
    awareness: externalAwareness,
}: {
    roomName: string;
    username: string;
    throttleMs: number;
    ydoc?: Y.Doc;
    awareness?: Awareness;
}) => {
    const [color] = useState(() => `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`);
    const [userId] = useState(
        () => globalThis.crypto?.randomUUID?.() ?? `client-${Math.random().toString(36).slice(2)}`,
    );
    const setCursors = useRealtimeCursorStore((s) => s.setCursors);
    const cursors = useRealtimeCursorStore((s) => s.cursors);

    const callback = useCallback(
        (event: MouseEvent) => {
            const payload: CursorEventPayload = {
                position: { x: event.clientX, y: event.clientY },
                user: { id: userId, name: username },
                color,
                timestamp: Date.now(),
            };
            // y-partykit awareness: set local state
            if (externalAwareness) {
                externalAwareness.setLocalStateField("cursor", payload);
            }
        },
        [color, userId, username, externalAwareness],
    );

    const handleMouseMove = useThrottleCallback(callback, throttleMs);

    useEffect(() => {
        if (!externalAwareness) return;
        const handler = () => {
            const states = externalAwareness.getStates();
            const next: Record<string, CursorEventPayload> = {};
            states.forEach((state, clientId) => {
                if (String(clientId) === String(externalAwareness.clientID)) return;
                const cursor = (state as Record<string, unknown>)["cursor"] as
                    | CursorEventPayload
                    | undefined;
                const user = (state as Record<string, unknown>)["user"] as
                    | { name: string }
                    | undefined;
                if (cursor) {
                    next[cursor.user.id] = cursor;
                } else if (user) {
                    // fallback if only user present without cursor yet
                }
            });
            setCursors(next);
        };
        externalAwareness.on("change", handler);
        return () => externalAwareness.off("change", handler);
    }, [externalAwareness, setCursors]);

    useEffect(() => {
        addEventListener("mousemove", handleMouseMove);
        return () => removeEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove]);

    return { cursors };
};