if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, V as require_react } from "../_libs/@astryxdesign/core+[...].mjs";
import { R as redirect, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, l as Scripts, m as lazyRouteComponent, u as HeadContent } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, r as createServerFn, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { i as eq, n as asc, r as desc } from "../_libs/drizzle-orm+postgres.mjs";
import { n as canvases, r as db, t as appUsers } from "./schema-Cg6pzVdV.mjs";
import { a as object, i as number, n as array, o as record, r as boolean, s as string, t as any } from "../_libs/zod.mjs";
import { d as os, n as SmartCoercionPlugin } from "../_libs/@orpc/json-schema+[...].mjs";
import { O as onError, u as ORPCError } from "../_libs/@orpc/client+[...].mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as OpenAPIHandler, r as RPCHandler, t as OpenAPIReferencePlugin } from "../_libs/@orpc/openapi+[...].mjs";
import { t as ZodToJsonSchemaConverter } from "../_libs/orpc__zod+zod.mjs";
import { createHash } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DxP5WpVz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var authInput = object({
	username: string().min(1, "Username is required"),
	password: string().min(1, "Password must be at least 1 characters").max(128, "Password is too long")
});
var getCurrentUser = createServerFn({ method: "GET" }).handler(createSsrRpc("d5e82007b47147f145f963d5be968dacdc8650b94e7b7acbccd798481667f8c2"));
var signIn = createServerFn({ method: "POST" }).validator(authInput).handler(createSsrRpc("a4d3d4730f48f1e2519ac989fac8f688ba4c010085f3723244762dd3de614dca"));
var signUp = createServerFn({ method: "POST" }).validator(authInput).handler(createSsrRpc("8fe7bbce9692fe7ceb3a35635e6520a7e1bd465714761009724ddc71260b5add"));
var logout = createServerFn({ method: "POST" }).handler(createSsrRpc("1b90f4feb8175e40785b2aba78db201a0b0269327953c16d833808a1166bd7cd"));
var base = os.$context();
var SharedWithFieldSchema = object({ sharedWith: array(string()) });
var CanvasAppStateSchema = object({}).loose();
function parseCanvasAppState(raw) {
	const parsed = CanvasAppStateSchema.safeParse(raw);
	if (!parsed.success) return { sharedWith: [] };
	const shared = SharedWithFieldSchema.safeParse(parsed.data);
	return shared.success ? shared.data : { sharedWith: [] };
}
function toMeta(row, currentUser) {
	const shared = parseCanvasAppState(row.appState).sharedWith;
	return {
		id: row.id,
		title: row.title,
		createdAt: row.createdAt?.toISOString() ?? "",
		updatedAt: row.updatedAt?.toISOString() ?? "",
		owner: row.userId || "Anonymous",
		isOwner: currentUser ? row.userId === currentUser : false,
		sharedWith: shared
	};
}
function toData(row, currentUser) {
	const raw = row.appState && typeof row.appState === "object" ? row.appState : {};
	const files = raw.files && typeof raw.files === "object" ? raw.files : {};
	return {
		...toMeta(row, currentUser),
		elements: row.elements,
		appState: row.appState,
		files
	};
}
function fail(error) {
	throw new ORPCError("INTERNAL_SERVER_ERROR", { message: error.message });
}
var create = base.input(object({ title: string() })).output(object({
	id: string(),
	title: string(),
	createdAt: string(),
	updatedAt: string(),
	owner: string(),
	isOwner: boolean(),
	sharedWith: array(string())
})).handler(async ({ input, context }) => {
	const username = context.user?.username;
	if (!username) throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
	const now = /* @__PURE__ */ new Date();
	const row = (await db.insert(canvases).values({
		userId: username,
		title: input.title.trim() || "Untitled",
		elements: [],
		appState: { sharedWith: [] },
		createdAt: now,
		updatedAt: now
	}).returning())[0];
	if (!row) return fail({ message: "Failed to create canvas" });
	return toMeta(row, username);
});
var save = base.input(object({
	id: string(),
	elements: any(),
	appState: any(),
	files: record(string(), any()).optional()
})).handler(async ({ input, context }) => {
	const username = context.user?.username;
	if (!username) throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
	const [existing] = await db.select({
		userId: canvases.userId,
		appState: canvases.appState
	}).from(canvases).where(eq(canvases.id, input.id)).limit(1);
	if (!existing) throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
	const shared = parseCanvasAppState(existing.appState).sharedWith;
	if (existing.userId !== username && !shared.includes(username)) throw new ORPCError("FORBIDDEN", { message: "No permission to edit this canvas." });
	const ex = existing.appState && typeof existing.appState === "object" ? existing.appState : {};
	const exFiles = ex.files && typeof ex.files === "object" ? ex.files : {};
	await db.update(canvases).set({
		elements: input.elements,
		appState: {
			...parseCanvasAppState(input.appState),
			sharedWith: shared,
			files: input.files ?? exFiles
		},
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(canvases.id, input.id));
});
var rename = base.input(object({
	id: string(),
	title: string()
})).handler(async ({ input, context }) => {
	const username = context.user?.username;
	if (!username) throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
	const [existing] = await db.select({
		userId: canvases.userId,
		appState: canvases.appState
	}).from(canvases).where(eq(canvases.id, input.id)).limit(1);
	if (!existing) throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
	const shared = parseCanvasAppState(existing.appState).sharedWith;
	if (existing.userId !== username && !shared.includes(username)) throw new ORPCError("FORBIDDEN", { message: "No permission to rename this canvas." });
	await db.update(canvases).set({
		title: input.title.trim() || "Untitled",
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(canvases.id, input.id));
});
var remove = base.input(object({ id: string() })).handler(async ({ input, context }) => {
	const username = context.user?.username;
	if (!username) throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
	const [existing] = await db.select({ userId: canvases.userId }).from(canvases).where(eq(canvases.id, input.id)).limit(1);
	if (!existing) return;
	if (existing.userId !== username) throw new ORPCError("FORBIDDEN", { message: "Only the owner can delete this canvas." });
	await db.delete(canvases).where(eq(canvases.id, input.id));
});
var list = base.output(array(object({
	id: string(),
	title: string(),
	createdAt: string(),
	updatedAt: string(),
	owner: string(),
	isOwner: boolean(),
	sharedWith: array(string())
}))).handler(async ({ context }) => {
	const username = context.user?.username;
	if (!username) throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
	return (await db.select().from(canvases).orderBy(desc(canvases.updatedAt))).filter((row) => row.userId === username || parseCanvasAppState(row.appState).sharedWith.includes(username)).map((row) => toMeta(row, username));
});
var get = base.input(object({ id: string() })).output(object({
	id: string(),
	title: string(),
	createdAt: string(),
	updatedAt: string(),
	owner: string(),
	isOwner: boolean(),
	sharedWith: array(string()),
	elements: any(),
	appState: any(),
	files: any().optional()
}).nullable()).handler(async ({ input, context }) => {
	const username = context.user?.username;
	if (!username) throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
	const [row] = await db.select().from(canvases).where(eq(canvases.id, input.id)).limit(1);
	if (!row) return null;
	const shared = parseCanvasAppState(row.appState).sharedWith;
	if (row.userId !== username && !shared.includes(username)) throw new ORPCError("FORBIDDEN", { message: "No access to this canvas." });
	return toData(row, username);
});
var share = base.input(object({
	id: string(),
	targetUsername: string()
})).handler(async ({ input, context }) => {
	const username = context.user?.username;
	if (!username) throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
	const target = input.targetUsername.trim().toLowerCase();
	if (!target) throw new ORPCError("BAD_REQUEST", { message: "Target username is required" });
	if (target === username) throw new ORPCError("BAD_REQUEST", { message: "You are already the owner" });
	const [targetUser] = await db.select({ username: appUsers.username }).from(appUsers).where(eq(appUsers.username, target)).limit(1);
	if (!targetUser) throw new ORPCError("NOT_FOUND", { message: `User "${target}" does not exist.` });
	const [canvas] = await db.select({
		userId: canvases.userId,
		appState: canvases.appState
	}).from(canvases).where(eq(canvases.id, input.id)).limit(1);
	if (!canvas) throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
	if (canvas.userId !== username) throw new ORPCError("FORBIDDEN", { message: "Only the owner can manage sharing." });
	const current = parseCanvasAppState(canvas.appState).sharedWith;
	if (current.includes(target)) return;
	await db.update(canvases).set({
		appState: {
			...parseCanvasAppState(canvas.appState),
			sharedWith: [...current, target]
		},
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(canvases.id, input.id));
});
var unshare = base.input(object({
	id: string(),
	targetUsername: string()
})).handler(async ({ input, context }) => {
	const username = context.user?.username;
	if (!username) throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
	const target = input.targetUsername.trim().toLowerCase();
	const [canvas] = await db.select({
		userId: canvases.userId,
		appState: canvases.appState
	}).from(canvases).where(eq(canvases.id, input.id)).limit(1);
	if (!canvas) throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
	if (canvas.userId !== username) throw new ORPCError("FORBIDDEN", { message: "Only the owner can manage sharing." });
	const updated = parseCanvasAppState(canvas.appState).sharedWith.filter((u) => u !== target);
	await db.update(canvases).set({
		appState: {
			...parseCanvasAppState(canvas.appState),
			sharedWith: updated
		},
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(canvases.id, input.id));
});
var listUsers = base.output(array(string())).handler(async ({ context }) => {
	return (await db.select({ username: appUsers.username }).from(appUsers).orderBy(asc(appUsers.username))).map((u) => u.username).filter((u) => u !== context.user?.username);
});
var UPLOAD_ENDPOINT = "https://imgcdn.dev/api/1/upload";
var API_KEY = "5386e05a3562c7a8f984e73401540836";
var inflight = /* @__PURE__ */ new Map();
async function s3Upload(body) {
	const cacheKey = createHash("sha1").update(body).digest("hex");
	const existing = inflight.get(cacheKey);
	if (existing) return existing;
	const promise = doUpload(body).catch((err) => {
		inflight.delete(cacheKey);
		throw err;
	});
	inflight.set(cacheKey, promise);
	return promise;
}
async function doUpload(body) {
	const form = new FormData();
	form.set("key", API_KEY);
	form.set("source", body.toString("base64"));
	form.set("format", "json");
	const response = await fetch(UPLOAD_ENDPOINT, {
		method: "POST",
		body: form
	});
	const rawText = await response.text();
	let result;
	try {
		result = JSON.parse(rawText);
	} catch {
		throw new Error(`imgcdn.dev returned non-JSON response (${response.status}): ${rawText}`);
	}
	if (!response.ok) {
		if (result.error?.code === 101) {
			const dupUrl = findFirstUrl(result);
			if (dupUrl) return dupUrl;
		}
		throw new Error(`imgcdn.dev upload failed (${response.status}): ${result.error?.message ?? rawText}`);
	}
	const url = result.image?.url ?? result.image?.display_url ?? result.url;
	if (!url) throw new Error(`imgcdn.dev response missing url: ${rawText}`);
	return url;
}
function findFirstUrl(obj) {
	if (!obj || typeof obj !== "object") return null;
	for (const value of Object.values(obj)) {
		if (typeof value === "string" && value.startsWith("http")) return value;
		if (typeof value === "object") {
			const nested = findFirstUrl(value);
			if (nested) return nested;
		}
	}
	return null;
}
var uploadAsset = base.input(object({
	canvasId: string(),
	fileId: string(),
	mimeType: string(),
	base64Data: string()
})).output(object({
	fileId: string(),
	url: string(),
	mimeType: string()
})).handler(async ({ input, context }) => {
	const username = context.user?.username;
	if (!username) throw new ORPCError("UNAUTHORIZED", { message: "Not authenticated" });
	const [existing] = await db.select({
		userId: canvases.userId,
		appState: canvases.appState
	}).from(canvases).where(eq(canvases.id, input.canvasId)).limit(1);
	if (!existing) throw new ORPCError("NOT_FOUND", { message: "Canvas not found" });
	const shared = parseCanvasAppState(existing.appState).sharedWith;
	if (existing.userId !== username && !shared.includes(username)) throw new ORPCError("FORBIDDEN", { message: "No permission to upload assets to this canvas." });
	let cleanBase64 = input.base64Data;
	const commaIdx = cleanBase64.indexOf(",");
	if (commaIdx !== -1) cleanBase64 = cleanBase64.slice(commaIdx + 1);
	const ext = input.mimeType.split("/")[1]?.replace("+xml", "") || "bin";
	`${input.canvasId}${input.fileId}${ext}`;
	if (!cleanBase64 || cleanBase64.length === 0) throw new ORPCError("BAD_REQUEST", { message: "Empty image data" });
	if (!/^[A-Za-z0-9+/=_-]+$/.test(cleanBase64.slice(0, 1e3))) throw new ORPCError("BAD_REQUEST", { message: "Invalid base64 image data" });
	const buffer = Buffer.from(cleanBase64, "base64");
	if (buffer.length === 0) throw new ORPCError("BAD_REQUEST", { message: "Invalid base64 string." });
	const url = await s3Upload(buffer);
	return {
		fileId: input.fileId,
		url: `${url}?v=${Date.now()}`,
		mimeType: input.mimeType
	};
});
var router_default = { canvases: /* @__PURE__ */ __exportAll({
	create: () => create,
	get: () => get,
	list: () => list,
	listUsers: () => listUsers,
	remove: () => remove,
	rename: () => rename,
	save: () => save,
	share: () => share,
	unshare: () => unshare,
	uploadAsset: () => uploadAsset
}) };
function getContext() {
	return { queryClient: new QueryClient() };
}
function GlobalDialogs() {
	const [Dialogs, setDialogs] = (0, import_react.useState)();
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		import("./dialogs-CxII1x1Y.mjs").then((module) => {
			if (!cancelled) setDialogs(() => module.Dialogs);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	if (!Dialogs) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: null,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialogs, {})
	});
}
var themeScript = `(function(){try{var s=localStorage.getItem("drawy-theme");var t=s==="light"||s==="dark"?s:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var r=document.documentElement;r.classList.toggle("dark",t==="dark");r.dataset.theme=t;r.style.colorScheme=t;}catch(e){}})();`;
var Route$6 = createRootRouteWithContext()({
	head: () => ({ meta: [
		{ charSet: "utf-8" },
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1"
		},
		{ title: "Drawy" },
		{
			name: "description",
			content: "Drawy — a collaborative drawing workspace."
		}
	] }),
	shellComponent: RootDocument
});
function Devtools() {
	const [DevtoolsComponent, setDevtoolsComponent] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {}, []);
	if (!DevtoolsComponent) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DevtoolsComponent, {});
}
function RootDocument({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: themeScript } }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalDialogs, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Devtools, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitNotFoundComponentImporter = () => import("../_authenticated-CpFsNq3Q.mjs");
var $$splitComponentImporter$3 = () => import("../_authenticated-DOwiAXPj.mjs");
var Route$5 = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		if (!await getCurrentUser()) throw redirect({ to: "/login" });
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
var $$splitComponentImporter$2 = () => import("./login-DkDwaRiX.mjs");
var Route$4 = createFileRoute("/login")({
	beforeLoad: async () => {
		if (await getCurrentUser()) throw redirect({ to: "/" });
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("../_authenticated-Bwh8gedX.mjs");
var Route$3 = createFileRoute("/_authenticated/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
if (typeof window === "undefined") {
	Object.defineProperty(globalThis, "window", {
		value: globalThis,
		writable: true,
		configurable: true
	});
	if (!("document" in globalThis)) {
		const createElement = () => ({
			getContext: () => ({
				measureText: () => ({ width: 0 }),
				fillRect: () => {},
				clearRect: () => {},
				getImageData: () => ({ data: /* @__PURE__ */ new Uint8ClampedArray() }),
				putImageData: () => {},
				createImageData: () => ({ data: /* @__PURE__ */ new Uint8ClampedArray() }),
				setTransform: () => {},
				drawImage: () => {},
				save: () => {},
				fillText: () => {},
				restore: () => {},
				beginPath: () => {},
				moveTo: () => {},
				lineTo: () => {},
				closePath: () => {},
				stroke: () => {},
				translate: () => {},
				scale: () => {},
				rotate: () => {},
				arc: () => {},
				fill: () => {}
			}),
			style: {},
			classList: {
				toggle: () => {},
				add: () => {},
				remove: () => {},
				contains: () => false
			},
			setAttribute: () => {},
			getAttribute: () => null,
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
			appendChild: (child) => child,
			removeChild: (child) => child,
			querySelector: () => null,
			querySelectorAll: () => []
		});
		Object.defineProperty(globalThis, "document", {
			value: {
				createElement,
				documentElement: {
					classList: {
						toggle: () => {},
						add: () => {},
						remove: () => {}
					},
					dataset: {},
					style: {}
				},
				body: createElement(),
				head: createElement(),
				querySelector: () => null,
				querySelectorAll: () => [],
				addEventListener: () => {},
				removeEventListener: () => {},
				dispatchEvent: () => false
			},
			writable: true,
			configurable: true
		});
	}
	if (!("navigator" in globalThis)) Object.defineProperty(globalThis, "navigator", {
		value: {
			userAgent: "node",
			platform: "node"
		},
		writable: true,
		configurable: true
	});
	if (!("location" in globalThis)) {
		const fallbackOrigin = globalThis.location?.origin ?? "http://localhost:3000";
		Object.defineProperty(globalThis, "location", {
			value: {
				origin: fallbackOrigin,
				protocol: "http:",
				host: "localhost:3000",
				hostname: "localhost",
				port: "3000",
				pathname: "/",
				search: "",
				hash: "",
				href: fallbackOrigin + "/"
			},
			writable: true,
			configurable: true
		});
	}
	if (!("EXCALIDRAW_EXPORT_SOURCE" in globalThis)) globalThis.EXCALIDRAW_EXPORT_SOURCE = globalThis.location?.origin ?? "http://localhost:3000";
	if (!("devicePixelRatio" in globalThis)) globalThis.devicePixelRatio = 1;
	if (!("requestAnimationFrame" in globalThis)) globalThis.requestAnimationFrame = (callback) => setTimeout(() => callback(Date.now()), 0);
	if (!("cancelAnimationFrame" in globalThis)) globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
	if (!("matchMedia" in globalThis)) globalThis.matchMedia = () => ({
		matches: false,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false
	});
	class ElementStub {}
	if (!("Element" in globalThis)) globalThis.Element = ElementStub;
	if (!("HTMLElement" in globalThis)) globalThis.HTMLElement = class HTMLElement extends ElementStub {};
	if (!("SVGElement" in globalThis)) globalThis.SVGElement = class SVGElement extends ElementStub {};
	if (!("HTMLCanvasElement" in globalThis)) globalThis.HTMLCanvasElement = class HTMLCanvasElement extends ElementStub {};
}
var TodoSchema = object({
	id: number().int().min(1),
	name: string()
});
var handler$1 = new OpenAPIHandler(router_default, {
	interceptors: [onError((error) => {
		console.error(error);
	})],
	plugins: [new SmartCoercionPlugin({ schemaConverters: [new ZodToJsonSchemaConverter()] }), new OpenAPIReferencePlugin({
		schemaConverters: [new ZodToJsonSchemaConverter()],
		specGenerateOptions: {
			info: {
				title: "TanStack ORPC Playground",
				version: "1.0.0"
			},
			commonSchemas: {
				Todo: { schema: TodoSchema },
				UndefinedError: { error: "UndefinedError" }
			},
			security: [{ bearerAuth: [] }],
			components: { securitySchemes: { bearerAuth: {
				type: "http",
				scheme: "bearer"
			} } }
		},
		docsConfig: { authentication: { securitySchemes: { bearerAuth: { token: "default-token" } } } }
	})]
});
async function handle$1({ request }) {
	const user = await getCurrentUser();
	if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "content-type": "application/json" }
	});
	const { response } = await handler$1.handle(request, {
		prefix: "/api",
		context: {
			request,
			user
		}
	});
	return response ?? new Response("Not Found", { status: 404 });
}
var Route$2 = createFileRoute("/api/$")({ server: { handlers: {
	HEAD: handle$1,
	GET: handle$1,
	POST: handle$1,
	PUT: handle$1,
	PATCH: handle$1,
	DELETE: handle$1
} } });
var $$splitComponentImporter = () => import("../_id-CFhnJKdK.mjs");
var Route$1 = createFileRoute("/_authenticated/canvas/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var handler = new RPCHandler(router_default, { interceptors: [onError((error) => {
	console.error(error);
})] });
async function handle({ request }) {
	const user = await getCurrentUser();
	if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), {
		status: 401,
		headers: { "content-type": "application/json" }
	});
	const { response } = await handler.handle(request, {
		prefix: "/api/rpc",
		context: {
			request,
			user
		}
	});
	return response ?? new Response("Not Found", { status: 404 });
}
var Route = createFileRoute("/api/rpc/$")({ server: { handlers: {
	HEAD: handle,
	GET: handle,
	POST: handle,
	PUT: handle,
	PATCH: handle,
	DELETE: handle
} } });
var AuthenticatedRoute = Route$5.update({
	id: "/_authenticated",
	getParentRoute: () => Route$6
});
var LoginRoute = Route$4.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$6
});
var AuthenticatedIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedRoute
});
var ApiSplatRoute = Route$2.update({
	id: "/api/$",
	path: "/api/$",
	getParentRoute: () => Route$6
});
var AuthenticatedCanvasIdRoute = Route$1.update({
	id: "/canvas/$id",
	path: "/canvas/$id",
	getParentRoute: () => AuthenticatedRoute
});
var ApiRpcSplatRoute = Route.update({
	id: "/api/rpc/$",
	path: "/api/rpc/$",
	getParentRoute: () => Route$6
});
var AuthenticatedRouteChildren = {
	AuthenticatedIndexRoute,
	AuthenticatedCanvasIdRoute
};
var rootRouteChildren = {
	AuthenticatedRoute: AuthenticatedRoute._addFileChildren(AuthenticatedRouteChildren),
	LoginRoute,
	ApiSplatRoute,
	ApiRpcSplatRoute
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	const context = getContext();
	return createRouter({
		routeTree,
		context,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultNotFoundComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Not Found" }),
		Wrap: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
			client: context.queryClient,
			children
		})
	});
}
//#endregion
export { logout as a, getCurrentUser as i, Route$1 as n, signIn as o, router_default as r, signUp as s, router_exports as t };
