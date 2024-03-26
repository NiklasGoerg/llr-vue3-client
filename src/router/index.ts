import { createRouter, createWebHistory } from 'vue-router'
import MessageSender from '../components/MessageSender.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MessageSender
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
