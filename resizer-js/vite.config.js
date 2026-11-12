
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [wasm(), react()],

	worker: {
		format: "es",
	},

	build: {
		target: "esnext",

		// JavaScript minification
		minify: "oxc",

		// CSS optimization
		cssMinify: "lightningcss",

		// Disable production source maps
		sourcemap: false,

		// Split CSS into separate files
		cssCodeSplit: true,

		// Inline assets smaller than 4KB
		assetsInlineLimit: 4096,

		// Warn about large chunks
		chunkSizeWarningLimit: 1000,

		// Rollup output optimizations
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules")) {
						if (id.includes("react")) {
							return "react-vendor";
						}
					}
				},
			},
		},
	},
});
