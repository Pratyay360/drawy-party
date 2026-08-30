import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
// biome-ignore lint/correctness/noUnusedImports: defineConfig from vite vs vite-plus-core alias mismatch – suppressed
import { defineConfig } from "vite-plus";

export default defineConfig({
	server: {
		allowedHosts: true,
		proxy: (() => {
			const target =
				process.env.VITE_PARTYKIT_HOST ??
				process.env.VITE_PARTYKIT_URL ??
				undefined;
			if (!target) return undefined;
			// Vite proxy expects a full URL; if only a host is provided, prefix with http://
			const normalized = target.includes("://") ? target : `http://${target}`;
			return {
				"/parties": {
					target: normalized,
					ws: true,
					changeOrigin: true,
				},
			};
		})(),
	},
	ssr: {
		external: ["@excalidraw/excalidraw", "@excalidraw/laser-pointer"],
		noExternal: [],
	},
	plugins: [
		tanstackStart(),
		react(),
		tailwindcss(),
		nitro({
			preset: "vercel",
			features: {
				websocket: true,
			},
			rollupConfig: {
				external: ["@excalidraw/excalidraw", "@excalidraw/laser-pointer"],
				output: {
					banner:
						"if(typeof globalThis.requestAnimationFrame==='undefined')globalThis.requestAnimationFrame=cb=>setTimeout(()=>cb(Date.now()),0);if(typeof globalThis.cancelAnimationFrame==='undefined')globalThis.cancelAnimationFrame=id=>clearTimeout(id);try{var requestAnimationFrame=globalThis.requestAnimationFrame;var cancelAnimationFrame=globalThis.cancelAnimationFrame;}catch(e){}",
				},
			},
		}),
	],
} as unknown as Parameters<typeof defineConfig>[0]);
