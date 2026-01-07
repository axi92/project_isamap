import { defineStore } from 'pinia';
import { fetchCurrentUser, type UserAuthJson } from '@/_custom/service/authService';

const CACHE_KEY = 'userCache';
const CACHE_TTL_MS = 10 * 60 * 1000; // 30 minutes

export const useUserStore = defineStore('user', {
  state: (): { user: UserAuthJson | null } => ({
    user: null,
  }),
  actions: {
    async loadUser() {
      const cached = localStorage.getItem(CACHE_KEY);

      // I disabled caching of login state, now it gets checked on every refresh

      // if (cached) {
      //   const { user, timestamp } = JSON.parse(cached);
      //   const now = Date.now();
      //   if (now - timestamp < CACHE_TTL_MS) {
      //     if (user != null) {
      //       this.user = user;
      //       return;
      //     }
      //   }
      // }

      // If no valid cache, fetch from backend
      try {
        const fetchedUser = await fetchCurrentUser();
        this.user = fetchedUser;
        localStorage.setItem(CACHE_KEY, JSON.stringify({ user: fetchedUser, timestamp: Date.now() }));
      } catch {
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
