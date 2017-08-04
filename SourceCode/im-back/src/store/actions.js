import * as api from '../api'
import * as types from './mutation-types'

/* 顺序连接 */
export const init = async (store) => {
  /* 连接融云SOCK */
  await rongCloudInit(store)
  /* 获取用户信息，此应该是请求TOKEN时一并返回或去核心取 */
  await getUserInfo(store)
  /* 获取此对话历史消息 */
  await getHistoryMessage(store)
}

/* 取得用户信息 */
export const getUserInfo = async ({dispatch, commit}) => {
  await api.getUserInfo(userInfo => {
    commit(types.GET_USER_INFO, userInfo)
  })
}

/* 取得用户融云TOKEN */
export const getUserToken = async ({dispatch, commit, state}) => {
  await api.getUserTokenAsync((userToken) => {
    commit(types.GET_USER_TOKEN, userToken)
  }, state)
}

/* 连接融云 */
export const rongCloudInit = async ({dispatch, commit, state}) => {
  // 等待 getUserToken 获取完成
  await dispatch('getUserToken')

  let appKey = state.params.appKey
  let navi = state.params.navi

  if (navi !== '') {
    let config = {
      navi: navi
    }
    console.log('私有云')
    await global.RongIMLib.RongIMClient.init(appKey, null, config)
  } else {
    console.log('公有云')
    await global.RongIMLib.RongIMClient.init(appKey)
  }

  commit(types.SWITCH_THREAD)

  // 连接状态监听器
  global.RongIMClient.setConnectionStatusListener({
    onChanged: function (status) {
      switch (status) {
        case global.RongIMLib.ConnectionStatus.CONNECTED:
          commit(types.SET_USER_LIST)
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
  /* console.log(state.params.token) */
  global.RongIMClient.connect(state.params.token, {
    onSuccess: function (userId) {
      commit(types.SET_INIT_WINDOW)
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

/* 获取历史消息 */
export const getHistoryMessage = async ({state, commit}) => {
  /*
	注意事项：
		1：一定一定一定要先开通 历史消息云存储 功能，本服务收费，测试环境可免费开通
		2：timestrap第二次拉取必须为null才能实现循环拉取
	*/
	const count = 10;  // 2 <= count <= 20
	const timestrap = null; //0, 1483950413013

	var start = new Date().getTime();
	// await global.RongIMClient.getInstance().getHistoryMessages(state.conversationtype, state.currentThreadID, timestrap, count, {
	// 	onSuccess: function(list, hasMsg) {
	// 		//可通过sort订制其他顺序
	// 		console.log(list.length);
	// 		console.log(hasMsg);
	// 		// list.sort(function(a,b){
	// 		// 	return a.sentTime < b.sentTime;
	// 		// });
  //     console.log('历史消息', list)
	// 	},
	// 	onError: function(error) {
  //     console.log('获取历史消息失败！', error, start)
	// 	}
	// });
}

/* 发送对话信息 */
export const sendMessage = async ({commit, state}, payload) => {
  let content = {
    content: payload.msg,
    user: {
      'userId': state.currentUserId,
      'name': '张三',
      'portraitUri': 'http://rongcloud.cn/images/newVersion/log_wx.png'
    },
    extra: {
      'name': 'name',
      'age': 12
    }
  }

  let msg = new global.RongIMLib.TextMessage(content)
  let start = new Date().getTime()

  state.instance.sendMessage(state.conversationtype, state.currentThreadID, msg, {
    onSuccess: function (message) {
      console.log('发送文字消息成功', message)
      commit(types.SEND_MESSAGE)
    },
    onError: function (errorCode, message) {
      console.log(errorCode)
      console.log('发送文字消息失败', message, start)
    }
  })
}


