import { defineConfig } from 'vitest/config';
import solid from '@solidjs/vite-plugin';
import wasm from "vite-plugin-wasm";

export default defineConfig({
	plugins: [
		wasm(),
		solid({ start: true, extensions: [".jsx", ".tsx"], diagnostics: true }), // add `ssr: true` for streaming SSR
	],
	worker: {
		format: "es",
	},
	server: {
		port: 3000,
	},
	test: {
		environment: "jsdom",
		globals: false,
		setupFiles: ["./vitest-setup.ts"],
		// if you have few tests, try commenting this
		// out to improve performance:
		isolate: false,
	},
	build: {
		target: "esnext",
		assetsInlineLimit: 0,
	},
});
