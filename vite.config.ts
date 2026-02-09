import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const allowedHosts = env.VITE_ALLOWEDHOSTS
    ? env.VITE_ALLOWEDHOSTS.split(",")
    : [];

  return {
    server: {
      host: "::",
      port: 8081,
      hmr: {
        overlay: false,
      },
      allowedHosts,
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})