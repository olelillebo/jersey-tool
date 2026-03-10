import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes("node_modules")) return undefined;
          if (
            id.includes("/node_modules/react/") ||
            id.includes("/node_modules/react-dom/") ||
            id.includes("/node_modules/scheduler/") ||
            id.includes("/node_modules/use-sync-external-store/")
          ) {
            return "framework";
          }

          if (
            id.includes("/node_modules/@heroui/") ||
            id.includes("/node_modules/@react-aria/") ||
            id.includes("/node_modules/@react-stately/") ||
            id.includes("/node_modules/react-aria-components/") ||
            id.includes("/node_modules/tailwind-variants/") ||
            id.includes("/node_modules/tailwind-merge/")
          ) {
            return "heroui";
          }

          if (id.includes("/node_modules/@supabase/")) {
            return "supabase";
          }

          if (
            id.includes("/node_modules/motion/") ||
            id.includes("/node_modules/framer-motion/") ||
            id.includes("/node_modules/react-modal-sheet/")
          ) {
            return "motion";
          }

          if (id.includes("/node_modules/react-router/")) {
            return "router";
          }
          return undefined;
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@hoc": path.resolve(__dirname, "./src/hoc"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@customTypes": path.resolve(__dirname, "./src/types"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@queries": path.resolve(__dirname, "./src/queries"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
});
