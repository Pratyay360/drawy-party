if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { i as __toESM } from "./_runtime.mjs";
import { A as Heading, B as require_jsx_runtime, F as Icon, I as defineTheme, L as Button, M as VStack, N as HStack, P as IconButton, R as Text, V as require_react, _ as Token, b as Center, h as Theme, m as defineSyntaxTheme, v as Card, x as AppShell, y as Grid } from "./_libs/@astryxdesign/core+[...].mjs";
import { v as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { S as subscribeCanvasEvents, i as deleteCanvas, l as listCanvases, r as createCanvas } from "./_ssr/libraries-DWpPu51J.mjs";
import { A as Funnel, D as Info, F as Ellipsis, G as ChevronsLeft, H as CircleX, J as ChevronDown, K as ChevronRight, L as Copy, M as EyeOff, P as ExternalLink, U as CircleCheckBig, V as Clock, W as ChevronsRight, X as CheckCheck, Y as Check, Z as Calendar, _ as PenTool, b as Mic, c as Trash2, f as Search, h as Plus, it as ArrowDown, n as Wrench, nt as ArrowUpDown, q as ChevronLeft, s as TriangleAlert, t as X, tt as ArrowUp, u as Square, w as LoaderCircle, x as Menu, z as Columns2 } from "./_libs/lucide-react.mjs";
import { t as Sidebar } from "./_ssr/sidebar-DEIo0JJQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_authenticated-Bwh8gedX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var iconProps = {
	size: "1em",
	"aria-hidden": true
};
var butterIconRegistry = {
	close: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { ...iconProps }),
	chevronDown: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { ...iconProps }),
	chevronLeft: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { ...iconProps }),
	chevronRight: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { ...iconProps }),
	chevronsLeft: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsLeft, { ...iconProps }),
	chevronsRight: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsRight, { ...iconProps }),
	check: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { ...iconProps }),
	success: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { ...iconProps }),
	error: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { ...iconProps }),
	warning: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { ...iconProps }),
	info: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { ...iconProps }),
	calendar: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { ...iconProps }),
	clock: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { ...iconProps }),
	externalLink: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { ...iconProps }),
	menu: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { ...iconProps }),
	moreHorizontal: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { ...iconProps }),
	search: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { ...iconProps }),
	arrowUp: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { ...iconProps }),
	arrowDown: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { ...iconProps }),
	arrowsUpDown: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { ...iconProps }),
	funnel: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { ...iconProps }),
	eyeSlash: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { ...iconProps }),
	viewColumns: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Columns2, { ...iconProps }),
	copy: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { ...iconProps }),
	checkDouble: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { ...iconProps }),
	wrench: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { ...iconProps }),
	stop: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { ...iconProps }),
	microphone: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { ...iconProps })
};
/**
* Butter Theme
*
* Warm, golden buttery theme with blue accents.
* Sarina for display, Outfit for headings and body.
*
* Source palette (per design):
*   Accent  #225BFF   Gray    #868B99   Red     #FF7553
*   Orange  #FFA347   Yellow  #fdee8c   Green   #5DCE5F
*   Cyan    #60CFD3   Teal    #6CD9A8   Blue    #5681FF
*   Purple  #B780F6   Pink    #F680E8   Error   #FF5947
*   Warning #F8C726   Success #91D143
*
* All tonal ramps derived in CIELab (matches the algorithm used by
* ThemePalettePreview so card / badge / banner / strip render the
* same values). Regen via scripts/butter-palette-gen.mjs if sources
* change.
*/
/** Butter syntax palette — T25 / T80 of each color's ramp. */
var butterSyntax = defineSyntaxTheme({
	name: "xds-butter",
	tokens: {
		keyword: ["#52237b", "#ddb9f6"],
		string: ["#004800", "#a5d29d"],
		comment: ["#605f52", "#adac9e"],
		number: ["#622e00", "#f2bd81"],
		function: ["#203a6c", "#bdc5eb"],
		type: ["#52237b", "#ddb9f6"],
		variable: ["#605f52", "#adac9e"],
		operator: ["#605f52", "#adac9e"],
		constant: ["#622e00", "#f2bd81"],
		tag: ["#6d211c", "#f4b8ae"],
		attribute: ["#413e00", "#d6c957"],
		property: ["#00482d", "#94d3bb"],
		punctuation: ["#605f52", "#adac9e"],
		background: ["#FDFBE4", "#131107"]
	}
});
var butterTheme = defineTheme({
	name: "butter",
	typography: {
		scale: {
			base: 14,
			ratio: 1.25
		},
		body: {
			family: "Outfit",
			fallbacks: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
		},
		heading: {
			family: "Outfit",
			fallbacks: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif",
			weights: {
				3: "bold",
				4: "bold"
			}
		},
		code: {
			family: "JetBrains Mono",
			fallbacks: "\"SF Mono\", Monaco, Consolas, monospace"
		}
	},
	motion: {
		fast: 125,
		medium: 300,
		slow: 700,
		ratio: .75
	},
	syntax: butterSyntax,
	tokens: {
		"--color-accent": ["#225BFF", "#FDEE8C"],
		"--color-accent-muted": ["#225BFF33", "#FDEE8C40"],
		"--color-neutral": ["#1d1c110F", "#f3f2e21A"],
		"--color-background-surface": ["#FFFFFF", "#2E2117"],
		"--color-background-body": ["#FDFBE4", "#261A13"],
		"--color-overlay": ["#1d1c1180", "#261A13cc"],
		"--color-overlay-hover": ["#1d1c110D", "#f3f2e20D"],
		"--color-overlay-pressed": ["#1d1c111A", "#f3f2e21A"],
		"--color-background-muted": ["#f3f2e2", "#3A2A1F"],
		"--color-text-primary": ["#1d1c11", "#f3f2e2"],
		"--color-text-secondary": ["#605f52", "#adac9e"],
		"--color-text-disabled": ["#adac9e", "#605f52"],
		"--color-text-accent": ["#225BFF", "#FDEE8C"],
		"--color-on-dark": "#ffffff",
		"--color-on-light": "#1d1c11",
		"--color-on-accent": ["#ffffff", "#1d1c11"],
		"--color-on-success": ["#ccff88", "#0b2e00"],
		"--color-on-error": ["#ffe3de", "#600000"],
		"--color-on-warning": ["#ffeec3", "#3b2200"],
		"--color-icon-accent": ["#225BFF", "#FDEE8C"],
		"--color-icon-primary": ["#1d1c11", "#f3f2e2"],
		"--color-icon-secondary": ["#605f52", "#adac9e"],
		"--color-icon-disabled": ["#adac9e", "#605f52"],
		"--color-background-card": ["#FFFFFF", "#3A2A1F"],
		"--color-background-popover": ["#FFFFFF", "#3A2A1F"],
		"--color-background-inverted": ["#1d1c11", "#FDFBE4"],
		"--color-error": ["#771210", "#ffb4a6"],
		"--color-error-muted": ["#77121033", "#ffb4a640"],
		"--color-warning": ["#543700", "#f7be00"],
		"--color-warning-muted": ["#54370033", "#f7be0040"],
		"--color-success": ["#004700", "#99d94b"],
		"--color-success-muted": ["#00470033", "#99d94b40"],
		"--color-border": ["#e5e3d4", "#f3f2e21A"],
		"--color-border-emphasized": ["#C7C4B2", "#939184"],
		"--color-skeleton": ["#e5e3d4", "#49473b"],
		"--color-shadow": ["#1d1c111A", "#0000004D"],
		"--color-tint-hover": ["black", "white"],
		"--text-supporting-size": "12px",
		"--size-element-sm": "32px",
		"--size-element-md": "40px",
		"--size-element-lg": "48px",
		"--color-background-blue": ["#dbe1ff", "#dbe1ff"],
		"--color-border-blue": ["#bdc5eb", "#bdc5eb"],
		"--color-icon-blue": ["#203a6c", "#203a6c"],
		"--color-text-blue": ["#203a6c", "#203a6c"],
		"--color-background-cyan": ["#a9eff0", "#a9eff0"],
		"--color-border-cyan": ["#8dd2d3", "#8dd2d3"],
		"--color-icon-cyan": ["#004649", "#004649"],
		"--color-text-cyan": ["#004649", "#004649"],
		"--color-background-gray": ["#f0edd4", "#f0edd4"],
		"--color-border-gray": ["#d6d3b8", "#d6d3b8"],
		"--color-icon-gray": ["#4a4732", "#4a4732"],
		"--color-text-gray": ["#4a4732", "#4a4732"],
		"--color-background-green": ["#c1efb8", "#c1efb8"],
		"--color-border-green": ["#a5d29d", "#a5d29d"],
		"--color-icon-green": ["#004800", "#004800"],
		"--color-text-green": ["#004800", "#004800"],
		"--color-background-orange": ["#ffdcb6", "#ffdcb6"],
		"--color-border-orange": ["#f2bd81", "#f2bd81"],
		"--color-icon-orange": ["#622e00", "#622e00"],
		"--color-text-orange": ["#622e00", "#622e00"],
		"--color-background-pink": ["#ffd5fb", "#ffd5fb"],
		"--color-border-pink": ["#f0b3e8", "#f0b3e8"],
		"--color-icon-pink": ["#6c0a68", "#6c0a68"],
		"--color-text-pink": ["#6c0a68", "#6c0a68"],
		"--color-background-purple": ["#f2daff", "#f2daff"],
		"--color-border-purple": ["#ddb9f6", "#ddb9f6"],
		"--color-icon-purple": ["#52237b", "#52237b"],
		"--color-text-purple": ["#52237b", "#52237b"],
		"--color-background-red": ["#ffdad3", "#ffdad3"],
		"--color-border-red": ["#f4b8ae", "#f4b8ae"],
		"--color-icon-red": ["#6d211c", "#6d211c"],
		"--color-text-red": ["#6d211c", "#6d211c"],
		"--color-background-teal": ["#b0f0d7", "#b0f0d7"],
		"--color-border-teal": ["#94d3bb", "#94d3bb"],
		"--color-icon-teal": ["#00482d", "#00482d"],
		"--color-text-teal": ["#00482d", "#00482d"],
		"--color-background-yellow": ["#feee7b", "#feee7b"],
		"--color-border-yellow": ["#d6c957", "#d6c957"],
		"--color-icon-yellow": ["#413e00", "#413e00"],
		"--color-text-yellow": ["#413e00", "#413e00"],
		"--radius-none": "0px",
		"--radius-inner": "0.375rem",
		"--radius-element": "0.5rem",
		"--radius-container": "0.75rem",
		"--radius-page": "1.5rem",
		"--radius-full": "9999px",
		"--shadow-low": "0 2px 4px #1d1c110D, 0 4px 8px #1d1c111A",
		"--shadow-med": "0 2px 4px #1d1c110D, 0 4px 12px #1d1c111A",
		"--shadow-high": "0 4px 6px #1d1c111A, 0 12px 24px #1d1c1126",
		"--shadow-inset-hover": "inset 0px 0px 0px 2px #79786a30",
		"--shadow-inset-selected": "inset 0px 0px 0px 2px #79786a50",
		"--shadow-inset-success": "inset 0px 0px 0px 2px #00470030",
		"--shadow-inset-warning": "inset 0px 0px 0px 2px #54370030",
		"--shadow-inset-error": "inset 0px 0px 0px 2px #77121030"
	},
	components: {
		"top-nav-heading": { base: {
			color: "light-dark(#225BFF, #FDEE8C)",
			"--color-text-primary": "light-dark(#225BFF, #FDEE8C)"
		} },
		"top-nav-item": {
			base: { color: "light-dark(#6E92FF, #FDEE8CCC)" },
			selected: {
				color: "light-dark(#225BFF, #FDEE8C)",
				backgroundColor: "transparent",
				":hover": { backgroundColor: "var(--color-overlay-hover)" },
				":active": { backgroundColor: "var(--color-overlay-pressed)" }
			}
		},
		button: {
			base: {
				paddingBlock: "var(--spacing-3)",
				paddingInline: "var(--spacing-4)"
			},
			"variant:secondary": {
				backgroundColor: "transparent",
				borderWidth: "1.5px",
				borderStyle: "solid",
				borderColor: "light-dark(#225BFF, #FDEE8C)",
				color: "light-dark(#225BFF, #FDEE8C)",
				":hover": { backgroundColor: "light-dark(#225BFF14, #FDEE8C14)" }
			},
			"variant:ghost": { color: "light-dark(#225BFF, #FDEE8C)" },
			"variant:destructive": {
				backgroundColor: "light-dark(#ffdad3, #f4b8ae)",
				color: "light-dark(#550000, #6d211c)"
			}
		},
		badge: {
			base: {
				height: "30px",
				paddingBlock: "0",
				paddingInline: "var(--spacing-3)"
			},
			"variant:info": {
				backgroundColor: "#4883fd",
				color: "#ffffff"
			},
			"variant:neutral": {
				backgroundColor: "#ffee7b",
				color: "#225BFF"
			},
			"variant:success": {
				backgroundColor: "#91D143",
				color: "#1d1c11"
			},
			"variant:warning": {
				backgroundColor: "#ffc502",
				color: "#1d1c11"
			},
			"variant:error": {
				backgroundColor: "#fc473b",
				color: "#ffffff"
			}
		},
		banner: {
			"status:info": {
				"--color-accent-muted": "#4883fd",
				"--color-text-primary": "#ffffff",
				"--color-text-secondary": "#ffffff",
				"--color-accent": "#ffffff"
			},
			"status:success": {
				"--color-success-muted": "#91D143",
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#1d1c11",
				"--color-success": "#1d1c11"
			},
			"status:warning": {
				"--color-warning-muted": "#ffc502",
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#1d1c11",
				"--color-warning": "#1d1c11"
			},
			"status:error": {
				"--color-error-muted": "#fc473b",
				"--color-text-primary": "#ffffff",
				"--color-text-secondary": "#ffffff",
				"--color-error": "#ffffff"
			}
		},
		card: {
			base: {
				borderRadius: "var(--radius-container)",
				padding: "var(--spacing-4)"
			},
			"variant:info": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:success": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:warning": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:error": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:blue": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:cyan": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:gray": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:green": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:orange": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:pink": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:purple": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:red": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:teal": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:yellow": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			},
			"variant:muted": {
				"--color-text-primary": "#1d1c11",
				"--color-text-secondary": "#605f52"
			}
		},
		section: { base: { padding: "var(--spacing-4)" } },
		"progressbar-track": { base: { backgroundColor: "light-dark(#e5e3d4, #725538)" } },
		"progressbar-fill": {
			"variant:success": { backgroundColor: "#91D143" },
			"variant:warning": { backgroundColor: "#ffc502" },
			"variant:error": { backgroundColor: "#fc473b" }
		},
		"field-status": {
			"type:success": {
				backgroundColor: "#91D143",
				color: "#1d1c11"
			},
			"type:warning": {
				backgroundColor: "#ffc502",
				color: "#1d1c11"
			},
			"type:error": {
				backgroundColor: "#fc473b",
				color: "#ffffff"
			}
		},
		"text-input": {
			base: {
				paddingBlock: "var(--spacing-2)",
				paddingInline: "var(--spacing-3)",
				borderColor: "var(--color-border)"
			},
			"status:success": { "--color-success": "#91D143" },
			"status:warning": { "--color-warning": "#ffc502" },
			"status:error": { "--color-error": "#fc473b" }
		},
		textarea: {
			base: {
				paddingBlock: "var(--spacing-2)",
				paddingInline: "var(--spacing-3)",
				borderColor: "var(--color-border)"
			},
			"status:success": { "--color-success": "#91D143" },
			"status:warning": { "--color-warning": "#ffc502" },
			"status:error": { "--color-error": "#fc473b" }
		},
		"number-input": {
			base: {
				paddingBlock: "var(--spacing-2)",
				paddingInline: "var(--spacing-3)",
				borderColor: "var(--color-border)"
			},
			"status:success": { "--color-success": "#91D143" },
			"status:warning": { "--color-warning": "#ffc502" },
			"status:error": { "--color-error": "#fc473b" }
		},
		"date-input": {
			base: {
				paddingBlock: "var(--spacing-2)",
				paddingInline: "var(--spacing-3)",
				borderColor: "var(--color-border)"
			},
			"status:success": { "--color-success": "#91D143" },
			"status:warning": { "--color-warning": "#ffc502" },
			"status:error": { "--color-error": "#fc473b" }
		},
		"time-input": {
			base: {
				paddingBlock: "var(--spacing-2)",
				paddingInline: "var(--spacing-3)",
				borderColor: "var(--color-border)"
			},
			"status:success": { "--color-success": "#91D143" },
			"status:warning": { "--color-warning": "#ffc502" },
			"status:error": { "--color-error": "#fc473b" }
		},
		selector: {
			base: {
				paddingBlock: "var(--spacing-2)",
				paddingInline: "var(--spacing-3)",
				borderColor: "var(--color-border)"
			},
			"status:success": { "--color-success": "#91D143" },
			"status:warning": { "--color-warning": "#ffc502" },
			"status:error": { "--color-error": "#fc473b" }
		},
		"multi-selector": {
			base: {
				paddingBlock: "var(--spacing-2)",
				paddingInline: "var(--spacing-3)",
				borderColor: "var(--color-border)"
			},
			"status:success": { "--color-success": "#91D143" },
			"status:warning": { "--color-warning": "#ffc502" },
			"status:error": { "--color-error": "#fc473b" }
		},
		typeahead: {
			base: {
				paddingBlock: "var(--spacing-2)",
				paddingInline: "var(--spacing-3)",
				borderColor: "var(--color-border)"
			},
			"status:success": { "--color-success": "#91D143" },
			"status:warning": { "--color-warning": "#ffc502" },
			"status:error": { "--color-error": "#fc473b" }
		},
		tokenizer: {
			base: {
				paddingBlock: "var(--spacing-2)",
				paddingInline: "var(--spacing-3)",
				borderColor: "var(--color-border)"
			},
			"status:success": { "--color-success": "#91D143" },
			"status:warning": { "--color-warning": "#ffc502" },
			"status:error": { "--color-error": "#fc473b" }
		},
		text: {
			"type:display-1": { fontFamily: "Sarina, \"Brush Script MT\", \"Snell Roundhand\", cursive" },
			"type:display-2": { fontFamily: "Sarina, \"Brush Script MT\", \"Snell Roundhand\", cursive" },
			"type:display-3": { fontFamily: "Sarina, \"Brush Script MT\", \"Snell Roundhand\", cursive" }
		}
	},
	icons: butterIconRegistry
});
function formatUpdatedAt(iso) {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "";
	const now = /* @__PURE__ */ new Date();
	if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()) return `Today at ${date.toLocaleTimeString(void 0, {
		hour: "2-digit",
		minute: "2-digit"
	})}`;
	return date.toLocaleDateString(void 0, {
		month: "short",
		day: "numeric",
		year: date.getFullYear() !== now.getFullYear() ? "numeric" : void 0
	});
}
function Home() {
	const navigate = useNavigate();
	const [canvases, setCanvases] = (0, import_react.useState)([]);
	const [isCreating, setIsCreating] = (0, import_react.useState)(false);
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	const loadCanvases = (0, import_react.useCallback)(async () => {
		try {
			setCanvases(await listCanvases());
		} catch (error) {
			console.error("Failed to load canvases:", error);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		loadCanvases();
		addEventListener("canvas-updated", loadCanvases);
		const unsubscribe = subscribeCanvasEvents(loadCanvases);
		return () => {
			removeEventListener("canvas-updated", loadCanvases);
			unsubscribe();
		};
	}, [loadCanvases]);
	async function handleCreate() {
		setIsCreating(true);
		try {
			const title = (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, {
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			});
			const canvas = await createCanvas(title);
			navigate({
				to: "/canvas/$id",
				params: { id: canvas.id }
			});
		} catch (error) {
			console.error("Failed to create canvas:", error);
		} finally {
			setIsCreating(false);
		}
	}
	async function handleDelete(canvasId, event) {
		event.preventDefault();
		event.stopPropagation();
		setDeletingId(canvasId);
		try {
			await deleteCanvas(canvasId);
		} catch (error) {
			console.error("Failed to delete canvas:", error);
		} finally {
			setDeletingId(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Theme, {
		theme: butterTheme,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
			contentPadding: 4,
			sideNav: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
				gap: 5,
				maxWidth: 960,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
					justify: "between",
					align: "center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
						gap: 1,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
							level: 1,
							children: "Drawings"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
							type: "supporting",
							children: canvases.length === 0 ? "Create your first drawing to get started." : `${canvases.length} ${canvases.length === 1 ? "drawing" : "drawings"} · your canvases and drawings shared with you`
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						label: "New canvas",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							icon: Plus,
							size: "sm"
						}),
						onClick: handleCreate,
						isLoading: isCreating
					})]
				}), canvases.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid, {
					columns: {
						minWidth: 220,
						max: 3
					},
					gap: 3,
					children: canvases.map((canvas) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						padding: 3,
						onClick: () => navigate({
							to: "/canvas/$id",
							params: { id: canvas.id }
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VStack, {
							gap: 2,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
								justify: "between",
								align: "center",
								gap: 2,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
									gap: 0,
									width: "100%",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HStack, {
										align: "center",
										gap: 1,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
											weight: "medium",
											maxLines: 1,
											children: canvas.title
										}), !canvas.isOwner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Token, { label: `Shared by ${canvas.owner}` })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
										type: "supporting",
										children: formatUpdatedAt(canvas.updatedAt)
									})]
								}), canvas.isOwner && (deletingId === canvas.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									icon: LoaderCircle,
									size: "sm"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
									label: "Delete drawing",
									variant: "ghost",
									size: "sm",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										icon: Trash2,
										size: "sm"
									}),
									onClick: (e) => handleDelete(canvas.id, e),
									tooltip: "Delete drawing"
								}))]
							})
						})
					}, canvas.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					variant: "muted",
					padding: 6,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Center, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
						gap: 3,
						hAlign: "center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								icon: PenTool,
								size: "lg"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VStack, {
								gap: 1,
								hAlign: "center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									weight: "medium",
									children: "No drawings yet"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
									type: "supporting",
									children: "Start sketching — changes save automatically."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								label: "Create your first drawing",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									icon: Plus,
									size: "sm"
								}),
								onClick: handleCreate,
								isLoading: isCreating
							})
						]
					}) })
				})]
			})
		})
	});
}
//#endregion
export { Home as component };
