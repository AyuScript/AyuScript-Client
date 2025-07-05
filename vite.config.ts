import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey from 'vite-plugin-monkey';
import { version } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: true
  },
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'SilentWhisper',
        namespace: 'https://silentwhisper.cc/',
        description: 'A script aimed to enhance the experience of game florr.io',
        version: version,
        author: 'LittleSwift',
        include: ['https://florr.io/*', 'https://silentwhisper.cc/install/*'],
        grant: "none"
      },
    }),
  ],
  define: {
    VERSION: JSON.stringify(version),
  },
});
