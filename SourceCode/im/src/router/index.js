import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import userList from '@/views/userList'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/user/list',
      name: 'userList',
      component: userList
    }
  ]
})
