import { createRouter, createWebHistory } from '@ionic/vue-router';
import GlobalView from '../views/GlobalView.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: GlobalView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
