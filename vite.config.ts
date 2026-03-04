import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@client": path.resolve(__dirname, "./src/client"),
      "@components": path.resolve(__dirname, "./src/client/components"),
      "@routes": path.resolve(__dirname, "./src/client/routes"),
      "@assets": path.resolve(__dirname, "./src/client/assets"),
      "@server": path.resolve(__dirname, "./src/server"),
      "@lib": path.resolve(__dirname, "./src/server/lib"),
      "@shared": path.resolve(__dirname, "./src/shared"),
    },
  },
});
