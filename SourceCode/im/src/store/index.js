import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import config from '../../config/config'

Vue.use(Vuex)

const state = {
  debug: config.debug,
  serverUrl: config.serverUrl, /* 请求TOKEN的服务器地址 */
  appKey: config.appKey, /* 融云申请的应用KEY */
  userImgUrl: config.userImgUrl, // 用户头像前缀地址
  uploadFileTypes: config.uploadFileTypes, // 允许上传的文件类型
  checkToken: '', /* 商城登录后的验证TOKEN */
  userToken: '', /* 融云用户TOKEN */
  isQuery: 0, /* 是否只是查询消息 1是 */
  userInfo: { /* 用户信息 */
    userId: '1',
    userName: '用户名',
    gaiNumber: 'GW123456',
    thumb: '',
    token: '',
    userLevel: '0级会员'
  },
  emojis: [],
  currentUserId: null,
  currentThreadID: null,
  currentThreadName: '连接中...',
  currentThreadLogo: '',
  currentThreadGWCode: '',
  searchName: '', // 侧边栏搜索内容
  tipsMsg: '您还未选中或发起聊天，快去跟好友聊一聊吧',
  userList: [{ // 注意：此结构若变更接收消息设置用户列表处也得变
    targetId: '', /* 目标ID */
    gwCode: '', /* 用户GW号 */
    userLogo: '', /* 头像 */
    userName: '加载中...!', /* 商铺名称 */
    lastMessage: '若未响应，请刷新重试!', /* 最后一条消息内容 */
    lastMsgType: '',
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
        imageUri: '',
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
