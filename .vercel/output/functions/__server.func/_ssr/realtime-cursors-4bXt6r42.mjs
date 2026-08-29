if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, V as require_react } from "../_libs/@astryxdesign/core+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
import { v as MousePointer2 } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/realtime-cursors-4bXt6r42.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var initialState = { cursors: {} };
var useRealtimeCursorStore = create((set) => ({
	...initialState,
	setCursors: (value) => set((state) => ({ cursors: typeof value === "function" ? value(state.cursors) : value })),
	reset: () => set({ ...initialState })
}));
function useThrottleCallback(callback, delay) {
	const lastCall = (0, import_react.useRef)(0);
	const timeout = (0, import_react.useRef)(null);
	return (0, import_react.useCallback)((...args) => {
		const now = Date.now();
		const remainingTime = delay - (now - lastCall.current);
		if (remainingTime <= 0) {
			if (timeout.current) {
				clearTimeout(timeout.current);
				timeout.current = null;
			}
			lastCall.current = now;
			callback(...args);
		} else if (!timeout.current) timeout.current = setTimeout(() => {
			lastCall.current = Date.now();
			timeout.current = null;
			callback(...args);
		}, remainingTime);
	}, [callback, delay]);
}
var useRealtimeCursors = ({ roomName, username, throttleMs, ydoc, awareness: externalAwareness }) => {
	const [color] = (0, import_react.useState)(() => `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`);
	const [userId] = (0, import_react.useState)(() => globalThis.crypto?.randomUUID?.() ?? `client-${Math.random().toString(36).slice(2)}`);
	const setCursors = useRealtimeCursorStore((s) => s.setCursors);
	const cursors = useRealtimeCursorStore((s) => s.cursors);
	const handleMouseMove = useThrottleCallback((0, import_react.useCallback)((event) => {
		const payload = {
			position: {
				x: event.clientX,
				y: event.clientY
			},
			user: {
				id: userId,
				name: username
			},
			color,
			timestamp: Date.now()
		};
		if (externalAwareness) externalAwareness.setLocalStateField("cursor", payload);
	}, [
		color,
		userId,
		username,
		externalAwareness
	]), throttleMs);
	(0, import_react.useEffect)(() => {
		if (!externalAwareness) return;
		const handler = () => {
			const states = externalAwareness.getStates();
			const next = {};
			states.forEach((state, clientId) => {
				if (String(clientId) === String(externalAwareness.clientID)) return;
				const cursor = state["cursor"];
				const user = state["user"];
				if (cursor) next[cursor.user.id] = cursor;
				else if (user) {}
			});
			setCursors(next);
		};
		externalAwareness.on("change", handler);
		return () => externalAwareness.off("change", handler);
	}, [externalAwareness, setCursors]);
	(0, import_react.useEffect)(() => {
		addEventListener("mousemove", handleMouseMove);
		return () => removeEventListener("mousemove", handleMouseMove);
	}, [handleMouseMove]);
	return { cursors };
};
var Cursor = ({ className, style, color, name }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `pointer-events-none${className ? ` ${className}` : ""}`,
		style,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MousePointer2, {
			color,
			fill: color,
			size: 30
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 px-2 py-1 rounded-sm text-xs font-bold text-white text-center",
			style: { backgroundColor: color },
			children: name
		})]
	});
};
var RealtimeCursors = ({ roomName, username, awareness }) => {
	const { cursors } = useRealtimeCursors({
		roomName,
		username,
		throttleMs: 30,
		awareness
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: Object.keys(cursors).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cursor, {
		className: "fixed transition-transform ease-in-out z-50",
		style: {
			transitionDuration: "30ms",
			top: 0,
			left: 0,
			transform: `translate(${cursors[id].position.x}px, ${cursors[id].position.y}px)`
		},
		color: cursors[id].color,
		name: cursors[id].user.name
	}, id)) });
};
//#endregion
export { RealtimeCursors };
