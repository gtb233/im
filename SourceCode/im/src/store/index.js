import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import config from '../config'

Vue.use(Vuex)

const state = {
  serverUrl: config.serverUrl, /* 请求TOKEN的服务器地址 */
  appKey: 'mgb7ka1nmf10g', /* 融云申请的应用KEY */
  checkToken: '', /* 商城登录后的验证TOKEN */
  userToken: '', /* 融云用户TOKEN */
  userInfo: {}, /* 用户信息 */
  currentUserId: null,
  currentThreadID: null,
  userList: [
    {
      targetId: 'GW00104713', /* 目标ID */
      userLogo: 'http://qlogo2.store.qq.com/qzone/519430301/519430301/50?1495187229', /* 头像 */
      userName: '加载失败!', /* 商铺名称 */
      lastMessage: '请刷新重试!', /* 最后一条消息内容 */
      messagesNumber: '0', /* 消息数 */
      sendTime: '2017-8-3' /* 最后一条消息时间 */
    }
  ],
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
