import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import { execSync } from 'node:child_process';

const commitHash = execSync('git rev-parse HEAD').toString().trim();

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __GIT_COMMIT__: JSON.stringify(commitHash),
  },
  optimizeDeps: {
    noDiscovery: true,
  },
  plugins: [
    vue(),
    vueDevTools(),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
