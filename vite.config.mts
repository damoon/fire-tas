import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/fire-tas/",
  plugins: [
    VueRouter({
      dts: "./src/typed-router.d.ts",
    }),
    vue(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
