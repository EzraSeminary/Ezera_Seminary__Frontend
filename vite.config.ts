import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "@svgr/rollup";
import svgo from 'vite-plugin-svgo';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), svgo()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
  },
});
