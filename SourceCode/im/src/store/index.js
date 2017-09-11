import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import config from '../../config/config'

Vue.use(Vuex)

const state = {
  serverUrl: config.serverUrl, /* 请求TOKEN的服务器地址 */
  appKey: '6tnym1brnzv77', /* 融云申请的应用KEY */
  userImgUrl: 'http://172.18.7.64:8080', // 用户头像前缀地址
  checkToken: '', /* 商城登录后的验证TOKEN */
  userToken: '', /* 融云用户TOKEN */
  isQuery: 0, /* 是否只是查询消息 1是 */
  userInfo: { /* 用户信息 */
    userId: '1',
    username: '用户名',
    gaiNumber: 'GW123456',
    thumb: '',
    token: '',
    userLevel: '正式会员'
  },
  emojis: [],
  currentUserId: null,
  currentThreadID: null,
  currentThreadName: '连接中...',
  currentThreadLogo: '',
  searchName: '', // 侧边栏搜索内容
  userList: [{
    targetId: '', /* 目标ID */
    userLogo: '', /* 头像 */
    userName: '加载中...!', /* 商铺名称 */
    lastMessage: '若未响应，请刷新重试!', /* 最后一条消息内容 */
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
      content: {
        content: '欢迎咨询在线客服！',
        content_back: '', // 用于保存音频图片之类的原始文件数据
        messageName: 'TextMessage'
      },
      messageType: 'TextMessage',
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
