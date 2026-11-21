const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue')
  },
  {
    path: '/home',
    name: 'main',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/IndexPage.vue')
      },
      {
        path: 'breathing',
        name: 'breathing',
        component: () => import('@/pages/BreathingPage.vue')
      },
      {
        path: 'counselor',
        name: 'counselor',
        component: () => import('@/pages/CounselorPage.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue')
  }
]
export default routes
