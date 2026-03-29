import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'

const frontRoutes = [
  {
    path: '/home',
    component: HomePage,
  },
  {
    path: '/design',
    component:() => import('@/views/DesignPage.vue')
  },
  {
    path: '/login',
    component:() => import('@/views/LoginPage.vue')
  },
  {
    path: '/register',
    component:() => import('@/views/RegisterPage.vue')
  },
  {
    path: '/profile',
    component:() => import('@/views/ProfilePage.vue'),
  },
  {
    path: '/cards',
    component:() => import('@/views/MyCardsPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: frontRoutes,
})

export default router
