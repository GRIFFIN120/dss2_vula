import Vue from 'vue'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie'
import settings from '../../settings'

import content from './content'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: '登录',
    component: () => import('../views/Login')
  },
  {
    path: '/home',
    name: '主页',
    component: () => import('../views/Home'),
    children: content
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.name + ' - ' + settings.title
  if (to.path === '/login') return next()
  const token = Cookies.get('TOKEN')
  if (!token) return next('/login')
  next()
})

export default router
