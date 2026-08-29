if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
import { B as require_jsx_runtime } from "./_libs/@astryxdesign/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_authenticated-CpFsNq3Q.js
var import_jsx_runtime = require_jsx_runtime();
function NotFound() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Not found" });
}
//#endregion
export { NotFound as notFoundComponent };
