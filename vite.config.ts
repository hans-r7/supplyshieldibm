import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api/ibm-iam": {
        target: "https://iam.cloud.ibm.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ibm-iam/, ""),
      },
      "/api/watsonx": {
        target: "https://us-south.ml.cloud.ibm.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/watsonx/, ""),
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
