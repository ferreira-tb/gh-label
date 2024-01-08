import { createMemoryHistory, createRouter } from 'vue-router';

export const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/label',
      name: 'label',
      component: () => import('../views/LabelView.vue')
    },
    {
      path: '/status',
      name: 'status',
      component: () => import('../views/StatusView.vue')
    }
  ]
});
