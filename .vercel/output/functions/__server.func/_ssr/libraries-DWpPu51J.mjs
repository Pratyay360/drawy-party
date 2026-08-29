if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { i as getRequestHeaders } from "./ssr.mjs";
import { u as createRouterClient } from "../_libs/@orpc/json-schema+[...].mjs";
import { t as createRouterUtils } from "../_libs/@orpc/tanstack-query+[...].mjs";
import { r as router_default } from "./router-DxP5WpVz.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as PartySocket } from "../_libs/partysocket.mjs";
import { n as Doc, t as YPartyKitProvider } from "../_libs/y-partykit+y-protocols+yjs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/libraries-DWpPu51J.js
var emptyShareForm = {
	targetUser: "",
	availableUsers: [],
	isSharing: false,
	unsharingUser: null,
	errorMsg: null,
	copied: false
};
var useUIStore = create((set) => ({
	libraryModal: {
		isOpen: false,
		initialBrowseId: null
	},
	shareModal: {
		isOpen: false,
		canvasId: null,
		owner: "",
		isOwner: false,
		sharedWith: [],
		...emptyShareForm
	},
	openLibraryBrowser: (initialBrowseId = null) => set({ libraryModal: {
		isOpen: true,
		initialBrowseId
	} }),
	closeLibraryBrowser: () => set((state) => ({ libraryModal: {
		...state.libraryModal,
		isOpen: false,
		initialBrowseId: null
	} })),
	openShareCanvas: (payload) => set({ shareModal: {
		...payload,
		isOpen: true,
		...emptyShareForm
	} }),
	closeShareCanvas: () => set((state) => ({ shareModal: {
		...state.shareModal,
		isOpen: false
	} })),
	setShareTargetUser: (targetUser) => set((s) => ({ shareModal: {
		...s.shareModal,
		targetUser
	} })),
	setShareAvailableUsers: (availableUsers) => set((s) => ({ shareModal: {
		...s.shareModal,
		availableUsers
	} })),
	setShareIsSharing: (isSharing) => set((s) => ({ shareModal: {
		...s.shareModal,
		isSharing
	} })),
	setShareUnsharingUser: (unsharingUser) => set((s) => ({ shareModal: {
		...s.shareModal,
		unsharingUser
	} })),
	setShareErrorMsg: (errorMsg) => set((s) => ({ shareModal: {
		...s.shareModal,
		errorMsg
	} })),
	setShareCopied: (copied) => set((s) => ({ shareModal: {
		...s.shareModal,
		copied
	} }))
}));
var getORPCClient = () => createRouterClient(router_default, { context: () => ({ request: { headers: getRequestHeaders() } }) });
var client = getORPCClient();
createRouterUtils(client);
var SINGLETON_ROOM_ID = "index";
function mergeElements(local, remote) {
	if (!remote || remote.length === 0) return [...local];
	const byId = /* @__PURE__ */ new Map();
	for (const el of local) byId.set(el.id, el);
	for (const r of remote) {
		const existing = byId.get(r.id);
		if (!existing || (r.version ?? 0) >= (existing.version ?? 0)) byId.set(r.id, r);
	}
	return [...byId.values()];
}
var CanvasRealtime = class {
	canvasId;
	username;
	socket;
	ydoc;
	provider;
	presenceSocket;
	sceneCbs = /* @__PURE__ */ new Set();
	savedCbs = /* @__PURE__ */ new Set();
	presenceCbs = /* @__PURE__ */ new Set();
	lastRooms = {};
	sceneTimer = null;
	pendingScene = null;
	constructor(canvasId, username = "Anonymous") {
		this.canvasId = canvasId;
		this.username = username;
	}
	connect() {
		if (this.socket) return;
		const socket = new PartySocket({
			host: void 0,
			party: "main",
			room: this.canvasId
		});
		socket.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				if (data.type === "scene") this.sceneCbs.forEach((fn) => fn(data?.payload));
				else if (data.type === "saved") this.savedCbs.forEach((fn) => fn());
			} catch {}
		};
		this.socket = socket;
		const ydoc = new Doc();
		const provider = new YPartyKitProvider(void 0, this.canvasId, ydoc, { party: "main" });
		const awareness = provider.awareness;
		awareness.setLocalStateField("user", {
			name: this.username,
			color: `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`
		});
		const onAwareness = () => {
			const count = awareness.getStates().size;
			this.presenceCbs.forEach((fn) => fn(count));
		};
		awareness.on("change", onAwareness);
		setTimeout(onAwareness, 300);
		this.ydoc = ydoc;
		this.provider = provider;
		const pSocket = new PartySocket({
			host: void 0,
			party: "rooms",
			room: SINGLETON_ROOM_ID
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
	broadcastScene(elements, files) {
		if (!this.socket) return;
		this.pendingScene = {
			elements,
			files: files && Object.keys(files).length > 0 ? files : void 0
		};
		if (this.sceneTimer) return;
		this.sceneTimer = setTimeout(() => {
			this.sceneTimer = null;
			const payload = this.pendingScene;
			this.pendingScene = null;
			if (payload && this.socket) this.socket.send(JSON.stringify({
				type: "scene",
				payload
			}));
		}, 250);
	}
	broadcastSaved() {
		if (this.socket) this.socket.send(JSON.stringify({
			type: "saved",
			payload: {}
		}));
	}
	onScene(cb) {
		this.sceneCbs.add(cb);
		return () => this.sceneCbs.delete(cb);
	}
	onSaved(cb) {
		this.savedCbs.add(cb);
		return () => this.savedCbs.delete(cb);
	}
	onPresence(cb) {
		this.presenceCbs.add(cb);
		const cnt = this.provider?.awareness.getStates().size;
		if (cnt !== void 0 && cnt > 0) cb(cnt);
		else if (Object.keys(this.lastRooms).length > 0) cb(this.lastRooms[this.canvasId] ?? 0);
		return () => this.presenceCbs.delete(cb);
	}
	disconnect() {
		if (this.sceneTimer) {
			clearTimeout(this.sceneTimer);
			this.sceneTimer = null;
		}
		this.socket?.close();
		this.socket = void 0;
		this.provider?.destroy();
		this.ydoc?.destroy();
		this.presenceSocket?.close();
		this.ydoc = void 0;
		this.provider = void 0;
		this.presenceSocket = void 0;
		this.sceneCbs.clear();
		this.savedCbs.clear();
		this.presenceCbs.clear();
	}
};
var globalSocket = null;
var globalListeners = /* @__PURE__ */ new Set();
var pendingGlobalMessages = [];
function ensureGlobalSocket() {
	if (typeof window === "undefined") return null;
	if (globalSocket) return globalSocket;
	const socket = new PartySocket({
		host: void 0,
		party: "rooms",
		room: SINGLETON_ROOM_ID
	});
	socket.onmessage = (event) => {
		try {
			if (JSON.parse(event.data).type === "canvas-list-changed") globalListeners.forEach((fn) => fn());
		} catch {}
	};
	socket.onopen = () => {
		while (pendingGlobalMessages.length > 0) socket.send(pendingGlobalMessages?.shift);
	};
	globalSocket = socket;
	return socket;
}
function publishCanvasListChanged() {
	const socket = ensureGlobalSocket();
	const msg = JSON.stringify({ type: "canvas-list-changed" });
	if (socket?.readyState === WebSocket.OPEN) socket.send(msg);
	else pendingGlobalMessages.push(msg);
}
function subscribeCanvasListChanged(cb) {
	ensureGlobalSocket();
	globalListeners.add(cb);
	return () => globalListeners.delete(cb);
}
var REALTIME_CHANNEL = "canvas-updated";
var BROADCAST_CHANNEL = "drawy-canvas-updates";
function publishCanvasEvent() {
	dispatchEvent(new Event(REALTIME_CHANNEL));
	const channel = new BroadcastChannel(BROADCAST_CHANNEL);
	channel.postMessage({ type: REALTIME_CHANNEL });
	channel.close();
}
function subscribeCanvasEvents(cb) {
	const channel = new BroadcastChannel(BROADCAST_CHANNEL);
	const handler = (event) => {
		if (event.data?.type === REALTIME_CHANNEL) cb();
	};
	channel.addEventListener("message", handler);
	return () => {
		channel.removeEventListener("message", handler);
		channel.close();
	};
}
var CANVAS_UPDATED_EVENT = "canvas-updated";
function notifyCanvasUpdated() {
	dispatchEvent(new Event(CANVAS_UPDATED_EVENT));
}
function toCanvasData(row) {
	return {
		id: row.id,
		title: row.title,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
		owner: row.owner,
		isOwner: row.isOwner,
		sharedWith: row.sharedWith,
		elements: Array.isArray(row.elements) ? row.elements : [],
		appState: row.appState,
		files: row.files
	};
}
async function listCanvases() {
	return client.canvases.list();
}
async function createCanvas(title) {
	const canvas = await client.canvases.create({ title });
	notifyCanvasUpdated();
	publishCanvasEvent();
	publishCanvasListChanged();
	return canvas;
}
async function deleteCanvas(id) {
	await client.canvases.remove({ id });
	notifyCanvasUpdated();
	publishCanvasEvent();
	publishCanvasListChanged();
}
async function loadCanvas(id) {
	const canvas = await client.canvases.get({ id });
	if (!canvas) return null;
	return toCanvasData(canvas);
}
async function saveCanvas(id, elements, appState, files) {
	await client.canvases.save({
		id,
		elements: [...elements],
		appState: sanitizeExcalidrawAppState(appState),
		files: files || {}
	});
	notifyCanvasUpdated();
	publishCanvasEvent();
}
async function updateCanvasTitle(id, title) {
	await client.canvases.rename({
		id,
		title
	});
	notifyCanvasUpdated();
	publishCanvasEvent();
	publishCanvasListChanged();
}
async function shareCanvas(id, targetUsername) {
	await client.canvases.share({
		id,
		targetUsername
	});
	notifyCanvasUpdated();
	publishCanvasEvent();
	publishCanvasListChanged();
}
async function unshareCanvas(id, targetUsername) {
	await client.canvases.unshare({
		id,
		targetUsername
	});
	notifyCanvasUpdated();
	publishCanvasEvent();
	publishCanvasListChanged();
}
async function listAvailableUsers() {
	return client.canvases.listUsers();
}
async function uploadCanvasAsset(canvasId, fileId, mimeType, base64Data) {
	return client.canvases.uploadAsset({
		canvasId,
		fileId,
		mimeType,
		base64Data
	});
}
/** Keep only the app-state fields we persist, dropping transient editor state. */
function sanitizeExcalidrawAppState(appState) {
	if (!appState) return {};
	return {
		viewBackgroundColor: appState.viewBackgroundColor,
		gridSize: appState.gridSize,
		zenModeEnabled: appState.zenModeEnabled,
		gridModeEnabled: appState.gridModeEnabled,
		viewModeEnabled: appState.viewModeEnabled
	};
}
var LIBRARIES_API_URL = "https://libraries.excalidraw.com/libraries.json";
var SAVED_LIBRARIES_KEY = "drawy_saved_libraries";
var USER_LIBRARY_KEY = "drawy_user_library";
var LIBRARY_CONFIG_UPDATED_EVENT = "library-config-updated";
var LIBRARY_ITEMS_INSTALLED_EVENT = "library-items-installed";
function notifyLibraryConfigUpdated() {
	globalThis.dispatchEvent(new Event(LIBRARY_CONFIG_UPDATED_EVENT));
}
function onLibraryConfigUpdated(callback) {
	globalThis.addEventListener(LIBRARY_CONFIG_UPDATED_EVENT, callback);
	return () => globalThis.removeEventListener(LIBRARY_CONFIG_UPDATED_EVENT, callback);
}
function notifyLibraryItemsInstalled(items) {
	globalThis.dispatchEvent(new CustomEvent(LIBRARY_ITEMS_INSTALLED_EVENT, { detail: items }));
}
function requestLibraryBrowse(libraryId) {
	useUIStore.getState().openLibraryBrowser(libraryId);
}
/** Subscribe to libraries being installed/refreshed so canvases can merge them in. */
function onLibraryItemsInstalled(callback) {
	const handler = (event) => {
		const detail = event.detail;
		if (Array.isArray(detail)) callback(detail);
	};
	globalThis.addEventListener(LIBRARY_ITEMS_INSTALLED_EVENT, handler);
	return () => globalThis.removeEventListener(LIBRARY_ITEMS_INSTALLED_EVENT, handler);
}
async function getSavedLibraries() {
	try {
		const data = localStorage.getItem(SAVED_LIBRARIES_KEY);
		if (!data) return [];
		const parsed = JSON.parse(data);
		if (!Array.isArray(parsed)) return [];
		return parsed.map((lib) => ({
			...lib,
			items: Array.isArray(lib.items) ? lib.items : [],
			item_names: Array.isArray(lib.item_names) ? lib.item_names : []
		}));
	} catch (error) {
		console.error("Failed to parse saved libraries:", error);
		return [];
	}
}
/** Upsert the metadata bookmark for a library (content is managed separately). */
async function saveLibraryToConfig(library) {
	if (typeof window === "undefined") return;
	const next = (await getSavedLibraries()).filter((lib) => lib.id !== library.id);
	next.push(library);
	localStorage.setItem(SAVED_LIBRARIES_KEY, JSON.stringify(next));
	notifyLibraryConfigUpdated();
}
/** Persist fetched content (item names + normalized items) for a saved library. */
async function saveLibraryContent(id, itemNames, items) {
	const next = (await getSavedLibraries()).map((lib) => lib.id === id ? {
		...lib,
		item_names: itemNames,
		items,
		fetched_at: (/* @__PURE__ */ new Date()).toISOString()
	} : lib);
	localStorage.setItem(SAVED_LIBRARIES_KEY, JSON.stringify(next));
	notifyLibraryConfigUpdated();
}
async function removeLibraryFromConfig(id) {
	const saved = await getSavedLibraries();
	localStorage.setItem(SAVED_LIBRARIES_KEY, JSON.stringify(saved.filter((lib) => lib.id !== id)));
	notifyLibraryConfigUpdated();
}
/** The user's full in-editor library (downloaded + hand-added items), persisted. */
async function getUserLibrary() {
	const data = localStorage.getItem(USER_LIBRARY_KEY);
	const parsed = data ? JSON.parse(data) : [];
	return Array.isArray(parsed) ? parsed : [];
}
async function setUserLibrary(items) {
	localStorage.setItem(USER_LIBRARY_KEY, JSON.stringify(items));
}
var installQueue = Promise.resolve();
/**
* Install library items: merge them into the persisted user library (deduped)
* and notify any mounted canvas to merge them into the editor library.
*/
function installLibraryItems(items) {
	if (!Array.isArray(items) || items.length === 0) return Promise.resolve();
	const task = installQueue.then(async () => {
		try {
			const current = await getUserLibrary();
			const existingIds = new Set(current.map((item) => item.id));
			const newItems = items.filter((item) => !existingIds.has(item.id));
			await setUserLibrary([...current, ...newItems]);
		} catch (error) {
			console.error("Failed to persist installed library items:", error);
		}
		notifyLibraryItemsInstalled(items);
	});
	installQueue = task.catch(() => {});
	return task;
}
//#endregion
export { subscribeCanvasListChanged as C, useUIStore as D, uploadCanvasAsset as E, subscribeCanvasEvents as S, updateCanvasTitle as T, saveCanvas as _, getSavedLibraries as a, setUserLibrary as b, listAvailableUsers as c, mergeElements as d, onLibraryConfigUpdated as f, sanitizeExcalidrawAppState as g, requestLibraryBrowse as h, deleteCanvas as i, listCanvases as l, removeLibraryFromConfig as m, LIBRARIES_API_URL as n, getUserLibrary as o, onLibraryItemsInstalled as p, createCanvas as r, installLibraryItems as s, CanvasRealtime as t, loadCanvas as u, saveLibraryContent as v, unshareCanvas as w, shareCanvas as x, saveLibraryToConfig as y };
