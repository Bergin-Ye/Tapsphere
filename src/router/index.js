import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'

const frontRoutes = [
  {
    path: '/home',
    component: HomePage,
    children: [
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: frontRoutes,
})

export default router