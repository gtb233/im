import * as api from '../api'
import * as types from './mutation-types'

/* 顺序连接 */
export const init = async (store) => {
  await getUserToken(store)
  rongCloudInit(store)
  getUserInfo(store)
}

/* 取得用户信息 */
export const getUserInfo = async ({dispatch, commit}) => {
  api.getUserInfo(userInfo => {
    commit(types.GET_USER_INFO, userInfo)
  })
}

/* 取得用户融云TOKEN */
export const getUserToken = async ({dispatch, commit, state}) => {
  api.getUserTokenAsync((userToken) => {
    commit(types.GET_USER_TOKEN, userToken)
  }, state)
}

/* 连接融云 */
export const rongCloudInit = async ({dispatch, commit, state}) => {
  let appKey = state.params.appKey
  let token = state.params.token
  let navi = state.params.navi

  if (navi !== '') {
    let config = {
      navi: navi
    }
    console.log('私有云')
    global.RongIMLib.RongIMClient.init(appKey, null, config)
  } else {
    console.log('公有云')
    global.RongIMLib.RongIMClient.init(appKey)
  }

  // commit(types.SWITCH_THREAD)

  // 连接状态监听器
  global.RongIMClient.setConnectionStatusListener({
    onChanged: function (status) {
      switch (status) {
        case global.RongIMLib.ConnectionStatus.CONNECTED:
          console.log('连接成功')
          break
        case global.RongIMLib.ConnectionStatus.CONNECTING:
          console.log('正在链接')
          break
        case global.RongIMLib.ConnectionStatus.DISCONNECTED:
          console.log('断开连接')
          break
        case global.RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
          console.log('其他设备登录')
          break
        case global.RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
          console.log('域名不正确')
          break
        case global.RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
          console.log('网络不可用')
          break
      }
    }
  })

  global.RongIMClient.setOnReceiveMessageListener({
    // 接收到的消息
    onReceived: function (message) {
      // 判断消息类型
      console.log('新消息: ' + message.targetId)
      console.log(message)
      // callbacks.receiveNewMessage && callbacks.receiveNewMessage(message);
    }
  })

  /* 开始连接 */
  console.log(token)
  global.RongIMClient.connect(token, {
    onSuccess: function (userId) {
      // callbacks.getCurrentUser && callbacks.getCurrentUser({userId: userId})
      console.log('链接成功，用户id：' + userId)
    },
    onTokenIncorrect: function () {
      console.log('token无效')
      // 此处可添加重新获取
    },
    onError: function (errorCode) {
      console.log('=============================================')
      console.log(errorCode)
    }
  })
}
