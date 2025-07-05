import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey from 'vite-plugin-monkey';
import { version } from "./package.json";
import { jsConfuserPlugin } from "./plugins/jsConfuserPlugin";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: true
  },
  plugins: [
    vue(),
    jsConfuserPlugin(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'BetterFlorr',
        namespace: 'https://superping.top/',
        description: '更好的florr插件',
        version: version,
        author: 'Crystal_awa & LittleSwift',
        include: ['https://florr.io/*'],
        grant: "none"
      },
    }),
  ],
  define: {
    VERSION: JSON.stringify(version),
  },
});
