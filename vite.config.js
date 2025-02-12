import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import Unfonts from "unplugin-fonts/vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		svgr(),
		wasm(),
		topLevelAwait(),
		Unfonts({
			google: {
				families: [
					{
						name: "Source Sans 3",
						defer: true,
						styles: "ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700",
					},
					{
						name: "IBM Plex Sans",
						defer: true,
						styles: "ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700",
					},
				],
			},
		}),
	],
	resolve: {
		alias: {
			src: "/src",
			components: "/src/components",
			assets: "/src/assets",
			routes: "/src/routes",
		},
	},
});
