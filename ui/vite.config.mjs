import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import { execSync } from 'node:child_process';

// Safely resolve commit hash
const commitHash =
  process.env.COMMIT_SHA ??
  (() => {
    try {
      return execSync('git rev-parse HEAD').toString().trim();
    } catch {
      return 'unknown';
    }
  })();

export default defineConfig(({ mode }) => {
  // Load env files (.env, .env.production, etc.)
  const env = loadEnv(mode, process.cwd(), '');

  const apiBaseUrl =
    env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';

  const apiOrigin = (() => {
    try {
      const url = new URL(apiBaseUrl);
      return `${url.protocol}//${url.host}`;
    } catch {
      return 'http://localhost:3000';
    }
  })();

  return {
    define: {
      __GIT_COMMIT__: JSON.stringify(commitHash),
      __API_BASE_URL__: JSON.stringify(apiBaseUrl),
      __API_ORIGIN__: JSON.stringify(apiOrigin),
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
  };
});
