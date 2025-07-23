import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey from 'vite-plugin-monkey';
import { version } from "./package.json";
import * as path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: true,
  },
  resolve: {
    alias:  {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'AyuScript',
        namespace: 'https://ayuscript.cc/',
        description: 'A script aimed to enhance the experience of game florr.io',
        version: version,
        author: 'LittleSwift',
        include: ['https://florr.io/*', 'https://ayuscript.cc/install/*'],
        grant: "none"
      },
    }),
  ],
  define: {
    VERSION: JSON.stringify(version),
  },
});
