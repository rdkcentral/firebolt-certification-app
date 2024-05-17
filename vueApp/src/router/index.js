import { createRouter, createWebHistory } from 'vue-router';
import Catalog from '../views/Catalog.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Catalog,
    },
    {
      path: '/pr-deployments',
      name: 'prDeployments',
      component: () => import('../views/Builds.vue'),
    },
    {
      path: '/tag-deployments',
      name: 'tagDeployments',
      component: () => import('../views/Builds.vue'),
    },
  ],
});

export default router;
