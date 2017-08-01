// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import store from './store'
import { init } from './store/actions'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueResource)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {},
  router,
  store,
  template: '<App/>',
  components: { App }
})

init(store)

// /* 获取用户TOKEN */
// getUserToken(store)
// /* 连接融云SOCK */
// rongCloudInit(store)
// /* 获取用户信息，此应该是请求TOKEN时一并返回或去核心取 */
// getUserInfo(store)
