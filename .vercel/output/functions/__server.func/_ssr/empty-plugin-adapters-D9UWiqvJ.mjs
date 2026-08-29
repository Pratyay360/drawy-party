if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
//#region node_modules/.nitro/vite/services/ssr/assets/empty-plugin-adapters-D9UWiqvJ.js
var pluginSerializationAdapters = [];
var hasPluginAdapters = false;
//#endregion
export { hasPluginAdapters, pluginSerializationAdapters };
