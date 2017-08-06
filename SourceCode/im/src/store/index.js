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
  userInfo: {
    userId: '1',
    username: '测试用户',
    gaiNumber: 'GW123456',
    thumb: 'http://qlogo2.store.qq.com/qzone/519430301/519430301/50?1495187229',
    token: 'fgfdhdfhdfgh4564dg54sdg',
    userLevel: '正式会员'
  }, /* 用户信息 */
  currentUserId: null,
  currentThreadID: null,
  userList: [{
    targetId: '', /* 目标ID */
    userLogo: '', /* 头像 */
    userName: '加载中...!', /* 商铺名称 */
    lastMessage: '若失败，请刷新重试!', /* 最后一条消息内容 */
    messagesNumber: '0', /* 消息数 */
    sendTime: '', /* 最后一条消息时间 */
    active: 'active'
  }],
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
    'storeid': [{
      senderUserId: '', /* 以此参数为判断谁发的 */
      targetId: '',
      sentTime: '',
      messageId: '',
      content: {content: '你好，有什么可能帮你的吗？'},
      messageType: '',
      messageUId: ''
    }]
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
