import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import Server from '@/views/Server'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/server',
      name: 'server',
      component: Server
    }
  ]
})
