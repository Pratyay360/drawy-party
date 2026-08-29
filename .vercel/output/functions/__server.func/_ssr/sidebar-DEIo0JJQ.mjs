if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, D as SideNavHeading, E as SideNavItem, F as Icon, L as Button, M as VStack, O as SideNav, P as IconButton, R as Text, T as SideNavSection, V as require_react, k as SideNavCollapseButton } from "../_libs/@astryxdesign/core+[...].mjs";
import { _ as Link, b as useRouter, v as useNavigate, y as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as logout, i as getCurrentUser } from "./router-DxP5WpVz.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { C as subscribeCanvasListChanged, S as subscribeCanvasEvents, h as requestLibraryBrowse, i as deleteCanvas, l as listCanvases, r as createCanvas } from "./libraries-DWpPu51J.mjs";
import { S as LogOut, T as Library, _ as PenTool, c as Trash2, h as Plus, l as Sun, w as LoaderCircle, y as Moon } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sidebar-DEIo0JJQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "drawy-theme";
var SERVER_THEME = "light";
function getInitialTheme() {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === "light" || stored === "dark") return stored;
		return (matchMedia ? matchMedia("(prefers-color-scheme: dark)").matches : false) ? "dark" : "light";
	} catch {
		return SERVER_THEME;
	}
}
function applyTheme(theme) {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	root.classList.toggle("dark", theme === "dark");
	root.dataset.theme = theme;
	root.style.colorScheme = theme;
}
var currentTheme;
function getCurrentTheme() {
	if (currentTheme === void 0) currentTheme = getInitialTheme();
	return currentTheme;
}
var listeners = /* @__PURE__ */ new Set();
function subscribe(listener) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}
function setThemeInternal(next) {
	if (next === getCurrentTheme()) return;
	currentTheme = next;
	applyTheme(next);
	try {
		localStorage.setItem(STORAGE_KEY, next);
	} catch {}
	for (const listener of listeners) listener();
}
function useTheme() {
	const theme = (0, import_react.useSyncExternalStore)(subscribe, getCurrentTheme, () => SERVER_THEME);
	(0, import_react.useEffect)(() => {
		applyTheme(theme);
	}, [theme]);
	return {
		theme,
		setTheme: (0, import_react.useCallback)((next) => {
			setThemeInternal(next);
		}, []),
		toggleTheme: (0, import_react.useCallback)(() => {
			setThemeInternal(getCurrentTheme() === "dark" ? "light" : "dark");
		}, [])
	};
}
function readSidebarCollapsed() {
	return false;
}
var useSidebarStore = create((set) => ({
	isCollapsed: readSidebarCollapsed(),
	canvases: [],
	isCreating: false,
	deletingId: null,
	user: null,
	signingOut: false,
	setIsCollapsed: (isCollapsed) => {
		set({ isCollapsed });
	},
	setCanvases: (canvases) => set({ canvases }),
	setIsCreating: (isCreating) => set({ isCreating }),
	setDeletingId: (deletingId) => set({ deletingId }),
	setUser: (user) => set({ user }),
	setSigningOut: (signingOut) => set({ signingOut })
}));
function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === "dark";
	const label = isDark ? "Switch to light mode" : "Switch to dark mode";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
		label,
		tooltip: label,
		variant: "ghost",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			icon: isDark ? Sun : Moon,
			size: "sm"
		}),
		onClick: toggleTheme
	});
}
function groupCanvasesByDate(canvases) {
	const now = /* @__PURE__ */ new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const grouped = {
		Today: [],
		Older: []
	};
	canvases.map((canvas) => {
		if (new Date(canvas.updatedAt) >= today) grouped.Today.push(canvas);
		else grouped.Older.push(canvas);
	});
	return grouped;
}
function SidebarFooter() {
	const router = useRouter();
	const navigate = useNavigate();
	const user = useSidebarStore((s) => s.user);
	const setUser = useSidebarStore((s) => s.setUser);
	const signingOut = useSidebarStore((s) => s.signingOut);
	const setSigningOut = useSidebarStore((s) => s.setSigningOut);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		getCurrentUser().then((currentUser) => {
			if (!cancelled && currentUser) setUser({ username: currentUser.username });
		});
		return () => {
			cancelled = true;
		};
	}, [setUser]);
	async function handleSignOut() {
		setSigningOut(true);
		try {
			await logout();
			await router.invalidate();
			await navigate({ to: "/login" });
		} finally {
			setSigningOut(false);
		}
	}
	if (!user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
		gap: 1,
		padding: 3,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			type: "supporting",
			maxLines: 1,
			children: user.username
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			label: "Sign out",
			variant: "ghost",
			size: "sm",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				icon: LogOut,
				size: "sm"
			}),
			isLoading: signingOut,
			onClick: handleSignOut,
			width: "100%"
		})]
	});
}
function Sidebar() {
	const isCollapsed = useSidebarStore((s) => s.isCollapsed);
	const setIsCollapsed = useSidebarStore((s) => s.setIsCollapsed);
	const canvases = useSidebarStore((s) => s.canvases);
	const setCanvases = useSidebarStore((s) => s.setCanvases);
	const isCreating = useSidebarStore((s) => s.isCreating);
	const setIsCreating = useSidebarStore((s) => s.setIsCreating);
	const deletingId = useSidebarStore((s) => s.deletingId);
	const setDeletingId = useSidebarStore((s) => s.setDeletingId);
	const { id: currentCanvasId } = useParams({ strict: false });
	const navigate = useNavigate();
	const loadCanvases = (0, import_react.useCallback)(async () => {
		try {
			const result = await listCanvases();
			setCanvases(result);
		} catch (error) {
			console.error("Failed to load canvases:", error);
		}
	}, [setCanvases]);
	(0, import_react.useEffect)(() => {
		loadCanvases();
		addEventListener("canvas-updated", loadCanvases);
		const unsubscribe = subscribeCanvasEvents(loadCanvases);
		const unsubscribeList = subscribeCanvasListChanged(loadCanvases);
		return () => {
			removeEventListener("canvas-updated", loadCanvases);
			unsubscribe();
			unsubscribeList();
		};
	}, [loadCanvases]);
	async function handleCreateCanvas() {
		setIsCreating(true);
		try {
			const title = (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, {
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			});
			const newCanvas = await createCanvas(title);
			dispatchEvent(new Event("canvas-updated"));
			navigate({
				to: "/$id",
				params: { id: newCanvas.id }
			});
		} catch (error) {
			console.error("Failed to create canvas:", error);
		} finally {
			setIsCreating(false);
		}
	}
	async function handleDeleteCanvas(canvasId, event) {
		event.preventDefault();
		event.stopPropagation();
		setDeletingId(canvasId);
		try {
			await deleteCanvas(canvasId);
			dispatchEvent(new Event("canvas-updated"));
			if (canvasId === currentCanvasId) navigate({ to: "/" });
		} catch (error) {
			console.error("Failed to delete canvas:", error);
		} finally {
			setDeletingId(null);
		}
	}
	const grouped = groupCanvasesByDate(canvases);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SideNav, {
		collapsible: {
			isCollapsed,
			onCollapsedChange: setIsCollapsed,
			hasButton: false
		},
		resizable: {
			defaultWidth: 240,
			minWidth: 200,
			maxWidth: 320,
			autoSaveId: "drawy-sidebar-width"
		},
		header: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideNavHeading, {
			heading: "Drawy",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				icon: PenTool,
				size: "sm"
			}),
			headingHref: "/",
			as: Link
		}),
		topContent: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			label: "New canvas",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				icon: Plus,
				size: "sm"
			}),
			onClick: handleCreateCanvas,
			isLoading: isCreating,
			width: "100%"
		}),
		footerIcons: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
				label: "Libraries",
				tooltip: "Libraries",
				variant: "ghost",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					icon: Library,
					size: "sm"
				}),
				onClick: () => requestLibraryBrowse(null)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideNavCollapseButton, {})
		] }),
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarFooter, {}),
		children: [
			grouped.Today.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideNavSection, {
				title: "Today",
				children: grouped.Today.map((canvas) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideNavItem, {
					label: canvas.title,
					href: `/canvas/${canvas.id}`,
					as: Link,
					isSelected: canvas.id === currentCanvasId,
					endContent: canvas.isOwner ? deletingId === canvas.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						icon: LoaderCircle,
						size: "sm"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						label: "Delete canvas",
						variant: "ghost",
						size: "sm",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							icon: Trash2,
							size: "sm"
						}),
						onClick: (e) => handleDeleteCanvas(canvas.id, e)
					}) : null
				}, canvas.id))
			}),
			grouped.Older.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideNavSection, {
				title: "Older",
				children: grouped.Older.map((canvas) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideNavItem, {
					label: canvas.title,
					href: `/canvas/${canvas.id}`,
					as: Link,
					isSelected: canvas.id === currentCanvasId,
					endContent: canvas.isOwner ? deletingId === canvas.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						icon: LoaderCircle,
						size: "sm"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
						label: "Delete canvas",
						variant: "ghost",
						size: "sm",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							icon: Trash2,
							size: "sm"
						}),
						onClick: (e) => handleDeleteCanvas(canvas.id, e)
					}) : null
				}, canvas.id))
			}),
			canvases.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideNavSection, {
				title: "Drawings",
				isHeaderHidden: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
					gap: 2,
					hAlign: "center",
					padding: 3,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						type: "supporting",
						children: "No drawings yet"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						label: "Create one",
						variant: "ghost",
						size: "sm",
						onClick: handleCreateCanvas
					})]
				})
			})
		]
	});
}
//#endregion
export { useTheme as n, Sidebar as t };
