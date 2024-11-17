import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: 8081,
    origin: "http://0.0.0.0:8081",
  },
  preview: {
    port: 8081,
    strictPort: true,
  },
});
