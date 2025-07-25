import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchCurrentUser } from '@/service/authService'

const CACHE_KEY = 'userCache';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),
  actions: {
    async loadUser() {
      const cached = localStorage.getItem(CACHE_KEY);

      if (cached) {
        const { user, timestamp } = JSON.parse(cached);
        const now = Date.now();

        if (now - timestamp < CACHE_TTL_MS) {
          this.user = user;
          return;
        }
      }

      // If no valid cache, fetch from backend
      try {
        const fetchedUser = await fetchCurrentUser();
        this.user = fetchedUser;
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ user: fetchedUser, timestamp: Date.now() })
        );
      } catch (e) {
        this.user = null;
        localStorage.removeItem(CACHE_KEY);
      }
    },

    logout() {
      this.user = null;
      localStorage.removeItem(CACHE_KEY);
    },
  },
});