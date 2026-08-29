import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
	server: {
		allowedHosts: true,
		proxy: {
			"/parties": {
				target: process.env.VITE_PARTYKIT_HOST,
				ws: true,
				changeOrigin: true,
			},
		},
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
			preset: "cloudflare-pages",
			rollupConfig: {
				external: [/@excalidraw\/excalidraw/, /@excalidraw\/laser-pointer/],
				output: {
					banner:
						"if(typeof globalThis.requestAnimationFrame==='undefined')globalThis.requestAnimationFrame=cb=>setTimeout(()=>cb(Date.now()),0);if(typeof globalThis.cancelAnimationFrame==='undefined')globalThis.cancelAnimationFrame=id=>clearTimeout(id);try{var requestAnimationFrame=globalThis.requestAnimationFrame;var cancelAnimationFrame=globalThis.cancelAnimationFrame;}catch(e){}",
				},
			},
		}),
	],
});
