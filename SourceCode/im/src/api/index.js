import * as data from './mock-data'
import Vue from 'vue'
import VueResource from 'vue-resource'
import * as tool from '../lib/util'
/**
 * 各种api链接
 */

let RongIMLib = global.RongIMLib
let RongIMClient = global.RongIMLib.RongIMClient

Vue.use(VueResource)

const LATENCY = 16

export function getUserInfo (cb) {
  setTimeout(
    () => { cb(data.userInfo) },
    LATENCY
  )
}

// 获取回话列表
let getUserList = function (cb, state) {
  // 待考虑做缓存
  RongIMClient.getInstance().getConversationList({
    onSuccess: function (list) {
      let userList = []
      // 获取成功
      console.log('userList:' + list)

      let newDate = new Date()

      for (let info of list) {
        let userInfo = {}
        let _targetId = ''

        newDate.setTime(info.sentTime)
        _targetId = info.targetId
        userInfo.targetId = _targetId
        userInfo.sentTime = newDate.toLocaleDateString()
        userInfo.lastMessage = info.latestMessage.content.content
        userInfo.active = ''
        if (state.currentThreadID === _targetId) {
          userInfo.active = 'active'
        }
        /* 以下待修改成正确参数 */
        userInfo.userLogo = info.latestMessage.content.user.portraitUri
        userInfo.userName = info.targetId
        userInfo.messagesNumber = 0
        userList.push(userInfo)
      }
      cb(userList)
    },
    onError: function (error) {
      // 列表获取失败时处理
      console.log(error)
    }
  }, null)
}

export async function getUserTokenAsync (cb, state) {
  /* 请求获取TOKEN */
  let userToken = ''
  const user = tool.urlParse()['user']
  const currentThreadID = tool.urlParse()['storeid']
  if (!user || !currentThreadID) {
    alert('用户ID与商家ID数据异常！')
    return false
  }
  await Vue.http.get(
    state.serverUrl + 'api/token?userId=' + user + '&name=' + user + '&portraitUri=gemall_20170718171031_82ee053d-dbbb-42a9-a1c3-f12247df36b0.jpg',
    { name: '这是带参测试' }, { emulateJSON: true }
  ).then(response => {
    let data = response.body
    if (data.code === 200) {
      userToken = data.token
      console.log('userToken:  ' + userToken + '|||' + user)
    } else {
      console.log(response)
    }
  }, response => {
    alert('请求连接失败，请刷新页面重试！')
    console.log('请求TOKEN接口失败!')
  })
  await cb({ userToken, user, currentThreadID })
}

/**
 * 融云初始化
 *
 * @param {*} cb
 * @param {*} state
 */
export async function rongCloudInit (cb, state) {
  let appKey = state.appKey
  console.log('公有云:' + appKey)
  await RongIMLib.RongIMClient.init(appKey)
  // 返回数据
  let result = {
    connect: false,
    newMsg: null,
    userList: null
  }
  // 连接状态监听器
  RongIMClient.setConnectionStatusListener({
    onChanged: function (status) {
      switch (status) {
        case RongIMLib.ConnectionStatus.CONNECTED:
          result.connect = true // 前置防止异步超前
          getUserList((userList) => {
            result.userList = userList
            cb(result, 'connect')
          }, state)
          cb(result, 'connect')
          break
        case RongIMLib.ConnectionStatus.CONNECTING:
          console.log('正在链接')
          break
        case RongIMLib.ConnectionStatus.DISCONNECTED:
          console.log('断开连接')
          break
        case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
          console.log('其他设备登录')
          break
        case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
          console.log('域名不正确')
          break
        case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
          console.log('网络不可用')
          break
      }
    }
  })

  RongIMClient.setOnReceiveMessageListener({
    // 接收到的消息
    onReceived: function (message) {
      // 判断消息类型
      console.log('新消息: ' + message.targetId)
      result.msg = message
      cb(result, 'newMsg')
      console.log(message)
      // callbacks.receiveNewMessage && callbacks.receiveNewMessage(message);
    }
  })

  /* 开始连接 */
  /* console.log(state.params.token) */
  RongIMClient.connect(state.userToken, {
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

// 发送消息
export async function sendMsg (cb, state, obj) {
  var content = {
    // content:"hello " + encodeURIComponent('π，α，β'),
    content: obj.msg,
    user: { // 暂定发送用户信息
      'userId': state.currentUserId,
      'name': state.userInfo.username,
      'portraitUri': state.userInfo.thumb
    },
    extra: {// 接收方信息
      'name': state.currentThreadName,
      'userId': state.currentThreadID
    }
  }

  let msg = new RongIMLib.TextMessage(content)
  let start = new Date().getTime()
  const conversationtype = RongIMLib.ConversationType.PRIVATE
  RongIMClient.getInstance().sendMessage(conversationtype, state.currentThreadID, msg, {
    onSuccess: function (message) {
      console.log('发送文字消息成功', message, start)
      cb(obj)
    },
    onError: function (errorCode, message) {
      console.log(errorCode)
      console.log('发送文字消息失败', message, start)
    }
  })
}
