if (typeof globalThis.requestAnimationFrame === "undefined") globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
if (typeof globalThis.cancelAnimationFrame === "undefined") globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
try {
	globalThis.requestAnimationFrame;
	globalThis.cancelAnimationFrame;
} catch (e) {}
//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-Dr2-hreP.js
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/var/home/pmustafi/contexts/drawy/src/routes/__root.tsx",
		children: [
			"/_authenticated",
			"/login",
			"/api/$",
			"/api/rpc/$"
		],
		css: ["/assets/index-Of_3cbF9.css"],
		preloads: [
			"/assets/index-DY0harr8.js",
			"/assets/rolldown-runtime-Dd_uD5pT.js",
			"/assets/react-BatatxyT.js",
			"/assets/session-EQSoJMct.js",
			"/assets/link-Ks2hD6UF.js",
			"/assets/useRouter-05TcNKEE.js",
			"/assets/jsx-runtime-DREnUpxT.js",
			"/assets/useStore-5Vr_za1a.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-DY0harr8.js"
		} }]
	},
	"/_authenticated": {
		filePath: "/var/home/pmustafi/contexts/drawy/src/routes/_authenticated.tsx",
		children: ["/_authenticated/", "/_authenticated/canvas/$id"],
		preloads: ["/assets/_authenticated-DrFhxOuI.js", "/assets/_authenticated-v2rAxgud.js"]
	},
	"/login": {
		filePath: "/var/home/pmustafi/contexts/drawy/src/routes/login.tsx",
		children: void 0,
		preloads: [
			"/assets/login-ZzONs1jY.js",
			"/assets/createLucideIcon-CRUNpjwY.js",
			"/assets/TextInput-C-jYqoO6.js",
			"/assets/Card-Ct5Mo5fV.js",
			"/assets/pen-tool-CGVS1Qq1.js"
		]
	},
	"/_authenticated/": {
		filePath: "/var/home/pmustafi/contexts/drawy/src/routes/_authenticated/index.tsx",
		children: void 0,
		preloads: [
			"/assets/_authenticated-Ci3i6WGM.js",
			"/assets/createLucideIcon-CRUNpjwY.js",
			"/assets/useMenuHover-B2qUDfeY.js",
			"/assets/sidebar-Dus5cMg_.js",
			"/assets/Card-Ct5Mo5fV.js",
			"/assets/HStack-Dp5KYA65.js",
			"/assets/Token-CtrrZrhE.js",
			"/assets/pen-tool-CGVS1Qq1.js"
		]
	},
	"/_authenticated/canvas/$id": {
		filePath: "/var/home/pmustafi/contexts/drawy/src/routes/_authenticated/canvas/$id.tsx",
		children: void 0,
		preloads: [
			"/assets/_id-Cfb-P8pF.js",
			"/assets/createLucideIcon-CRUNpjwY.js",
			"/assets/useMenuHover-B2qUDfeY.js",
			"/assets/sidebar-Dus5cMg_.js"
		]
	}
} });
//#endregion
export { tsrStartManifest };
