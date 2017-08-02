import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  serverUrl: 'http://localhost:8000', /* 请求TOKEN的服务器地址 */
  appkey: 'mgb7ka1nmf10g', /* 融云申请的应用KEY */
  checkToken: '', /* 商城登录后的验证TOKEN */
  userToken: '', /* 融云用户TOKEN */
  params: {
    appKey: 'mgb7ka1nmf10g',
    token: '',
    navi: ''
  },
  instance: {}, /* 融云实例 */
  userInfo: {}, /* 用户信息 */
  currentThreadID: null,
  userList: { /* 用户列表 */

  },
  threads: {
    /*
    id: {
      id,
      name,
      messages: [...ids],
      lastMessage
    }
    */
  },
  messages: {
    /*
    id: {
      id,
      threadId,
      threadName,
      authorName,
      text,
      timestamp,
      isRead
    }
    */
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
