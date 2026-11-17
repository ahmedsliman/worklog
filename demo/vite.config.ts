import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
const require = createRequire(import.meta.url);
const tailwindcss = require("../pwa/node_modules/tailwindcss");
const autoprefixer = require("../pwa/node_modules/autoprefixer");
const tailwindConfig = require("../pwa/tailwind.config.js");

const path = (value: string) => fileURLToPath(new URL(value, import.meta.url));

export default defineConfig({
  plugins: [react(), cloudflare()],
  resolve: {
    alias: [
      { find: "@/lib/dataAccess", replacement: path("./dataAccess.ts") },
      { find: "next/link", replacement: path("./Link.tsx") },
      { find: "@", replacement: path("../pwa/src") },
      { find: "react-dom", replacement: path("../pwa/node_modules/react-dom") },
      { find: "react", replacement: path("../pwa/node_modules/react") },
    ],
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          ...tailwindConfig,
          content: [path("../pwa/src/**/*.{ts,tsx}"), path("./*.tsx")],
        }),
        autoprefixer(),
      ],
    },
  },
});
