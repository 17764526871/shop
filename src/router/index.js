import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Users from '@/components/Users'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/users',
          name: 'users',
          component: Users
        }
      ]
    }
  ]
})
// 登录保持
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('shoptoken')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
