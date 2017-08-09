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
const conversationtype = RongIMLib.ConversationType.PRIVATE

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
      console.log('userList:', list)

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
  await global.RongIMLib.RongIMEmoji.init() // 表情初始化
  await global.RongIMLib.RongIMVoice.init() // 声音初始化

  // 返回数据
  let result = {
    connect: false,
    newMsg: null,
    userList: null,
    emojis: []
  }
  // 连接状态监听器
  RongIMClient.setConnectionStatusListener({
    onChanged: function (status) {
      switch (status) {
        case RongIMLib.ConnectionStatus.CONNECTED:
          result.connect = true // 改为使用额外参数，防止重复调用
          getUserList((userList) => {
            result.userList = userList
            cb(result, 'connect')
          }, state)
          // 返回表情 此处回调处理时间会早于用于列表
          result.emojis = RongIMLib.RongIMEmoji.emojis
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

  // 接收消息
  RongIMClient.setOnReceiveMessageListener({
    onReceived: function (message) {
      console.log(message)
      // 判断消息类型
      message = filterMessage(message)
      result.msg = message
      cb(result, 'newMsg')
    }
  })

  /* 开始连接 */
  RongIMClient.connect(state.userToken, {
    onSuccess: function (userId) {
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

// 发送文本消息
export async function sendMsg (cb, state, obj) {
  if (obj.msg == null || obj.msg === '' || obj.msg === undefined) {
    return false
  }
  var content = {
    // content:"hello " + encodeURIComponent('π，α，β'),
    content: RongIMLib.RongIMEmoji.symbolToEmoji(obj.msg), // 名称 转 Emoji 消息体里必须使用原生 Emoji 字符
    // content: obj.msg,
    user: { // 暂定发送用户信息
      'userId': state.currentUserId,
      'name': state.userInfo.username,
      'portraitUri': state.userInfo.thumb
    },
    extra: { // 接收方信息
      'name': state.currentThreadName,
      'userId': state.currentThreadID,
      'portraitUri': state.userInfo.thumb
    }
  }

  let msg = new RongIMLib.TextMessage(content)
  let start = new Date().getTime()
  RongIMClient.getInstance().sendMessage(conversationtype, state.currentThreadID, msg, {
    onSuccess: function (message) {
      console.log('发送文字消息成功', message, start)
      obj.msg = RongIMLib.RongIMEmoji.symbolToHTML(obj.msg) // 列表展示数据处理
      cb(obj)
    },
    onError: function (errorCode, message) {
      console.log(errorCode)
      console.log('发送文字消息失败', message, start)
    }
  })
}

/* 获取历史消息，初始化时延迟一秒执行 */
export function getHistoryMsgAsync (cb, state) {
  /*
    注意事项：
      1：一定一定一定要先开通 历史消息云存储 功能，本服务收费，测试环境可免费开通
      2：timestrap第二次拉取必须为null才能实现循环拉取
  */
  setTimeout(() => {
    getHistoryMsg(cb, state)
  }, 1000)
}

/* 获取历史消息，实时 */
export const getHistoryMsg = (cb, state) => {
  const count = 10  // 2 <= count <= 20
  const timestrap = null // 0, 1483950413013

  let start = new Date().getTime()
  let result = {
    list: [],
    hasMsg: false
  }
  // 待考虑是否做成缓存
  RongIMClient.getInstance().getHistoryMessages(conversationtype, state.currentThreadID, timestrap, count, {
    onSuccess: function (list, hasMsg) {
      // hasMsg为boolean值，如果为true则表示还有剩余历史消息可拉取，为false的话表示没有剩余历史消息可供拉取。
      // 可通过sort订制其他顺序
      // list.sort(function (a, b) {
      //   return a.sentTime < b.sentTime
      // })
      console.log('历史消息', list)
      // 数据处理 RongIMLib.RongIMEmoji.emojiToHTML(message) unicode EMOJI转为HTML
      for (let key in list) {
        // list[key].content.content = RongIMLib.RongIMEmoji.emojiToHTML(list[key].content.content)
        list[key] = filterMessage(list[key])
      }
      result.list = list
      result.hasMsg = hasMsg
      cb(result)
    },
    onError: function (error) {
      console.log('获取历史消息失败！', error, start)
    }
  })
}

/* 消息过滤、处理 分为：文本（带表情）、音频、文件图片 */
let filterMessage = (message) => {
  // let result = {
  //   message: message,
  //   action: message.messageType
  // }
  switch (message.messageType) {
    /* 文本消息（带原生Emoji） */
    case RongIMClient.MessageType.TextMessage:
      // HTML形式 效果好，感觉不安全
      message.content.content = RongIMLib.RongIMEmoji.emojiToHTML(message.content.content)
      // 处理成原生EMOJI 兼容性有问题
      // message.content.content = RongIMLib.RongIMEmoji.emojiToSymbol(message.content.content)
      // message.content.content = RongIMLib.RongIMEmoji.symbolToEmoji(message.content.content)
      break

    /* 音频 */
    case RongIMClient.MessageType.VoiceMessage:
      // let audio = message.content.content // 格式为 AMR 格式的 base64 码
      // let duration = message.content.duration
      // RongIMLib.RongIMVoice.preLoaded(audio, function () {
      //   RongIMLib.RongIMVoice.play(audio, duration)
      // })
      break

    /* 文件（图片） */
    case RongIMClient.MessageType.ImageMessage:
      // message.content.content => 图片缩略图 base64。
      // message.content.imageUri => 原图 URL。
      // 具体待处理
      break

    /* 图文 */
    case RongIMClient.MessageType.RichContentMessage:
      // message.content.content => 文本消息内容。
      // message.content.imageUri => 图片 base64。
      // message.content.url => 原图 URL。
      break
    case RongIMClient.MessageType.InformationNotificationMessage:
        // do something...
      break
    case RongIMClient.MessageType.ContactNotificationMessage:
        // do something...
      break
    case RongIMClient.MessageType.ProfileNotificationMessage:
        // do something...
      break
    case RongIMClient.MessageType.CommandNotificationMessage:
        // do something...
      break
    case RongIMClient.MessageType.CommandMessage:
        // do something...
      break
    case RongIMClient.MessageType.UnknownMessage:
        // do something...
      break
    default:
  }
  return message
}
