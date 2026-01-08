import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/_custom/stores/auth.store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/map/:id',
      name: 'map',
      component: () => import('@/_custom/views/pages/Map.vue'),
      props: true, // optional: passes route params as props to the component
    },
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'dashboard',
          component: () => import('@/views/Dashboard.vue'),
        },
        {
          path: '/servers',
          name: 'servers',
          component: () => import('@/_custom/views/pages/ServerList.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
});

router.beforeEach(async (to) => {
  const userStore = useUserStore();

  if (!to.meta.requiresAuth) {
    return true;
  }

  // If user already loaded and valid → allow
  if (userStore.user) {
    return true;
  }

  // Otherwise ask backend
  try {
    await userStore.loadUser();

    if (userStore.user) {
      return true;
    }
  } catch {
    // ignore
  }
  // Not authenticated → redirect
  return {
    name: 'dashboard',
    query: { redirect: to.fullPath },
  };
});

export default router;
