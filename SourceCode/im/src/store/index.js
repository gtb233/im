import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  serverUrl: 'http://server.chat.com', /* 请求TOKEN的服务器地址 */
  appkey: 'mgb7ka1nmf10g', /* 融云申请的应用KEY */
  checkToken: '', /* 商城登录后的验证TOKEN */
  userToken: '', /* 融云用户TOKEN */
  params: {
    appKey: 'mgb7ka1nmf10g',
    token: 'qikZi+Lsv3kDhegzY3sFAjT7Xa7E7kGnu91Y1IDOAT08zh9nFHVD/0OHXHwEH8pFK437m4PgUTFYahu3SICJnx93MA3vLtSu',
    navi: ''
  },
  rongIMLibObj: global.RongIMLib, /* 融云对象，不可更改 */
  rongIMClient: global.RongIMLib.RongIMClient, /* 融云对象 */
  instance: {}, /* 融云实例 */
  userInfo: {},
  currentThreadID: null,
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
