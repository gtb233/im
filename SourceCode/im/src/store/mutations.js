import * as types from './mutation-types'

export default {
  /* 获取用户信息 */
  [types.GET_USER_INFO] (state, userInfo) {
    state.userInfo = userInfo
  },
  /* 获取用户TOKEN，设置用户ID、商家ID */
  [types.GET_USER_TOKEN] (state, userobj) {
    state.userToken = userobj.userToken
    state.currentUserId = userobj.user
    state.currentThreadID = userobj.currentThreadID
    state.currentThreadName = userobj.currentThreadID // 待改为从列表获取
  },
  /* 根据融云返回信息设置用户列表 */
  [types.SET_USER_LIST] (state, obj) {
    state.emojis = obj.emojis
    state.userList = obj.userList
    // 设置初始对话框用户名
    if (state.userList) {
      for (let info of state.userList) {
        if (info.targetId === state.currentThreadID) {
          state.currentThreadName = info.userName
        }
      }
    }
  },
  /* 获取历史消息 */
  [types.GET_HISTORY_MESSAGE] (state, obj) {
    // 初始化用户消息框数据
    state.messages[state.currentThreadID] = []
    // 添加消息内容到消息列表
    for (let info of obj.list) {
      let messageList = state.messages[state.currentThreadID]
      let messageInfo = {
        senderUserId: info.senderUserId, /* 以此参数为判断谁发的 */
        targetId: state.currentThreadID, /* 历史消息与发送与接收设置的都不同，注意区分 */
        sentTime: info.sentTime,
        messageId: info.messageId,
        content: info.content, // 此为对象，注意
        messageType: info.messageType,
        messageUId: info.messageUId
      }
      if (messageList) {
        messageList.push(messageInfo)
        state.messages[state.currentThreadID] = messageList
      } else {
        let storeMsg = {
          [state.currentThreadID]: [messageInfo]
        }
        Object.assign(state.messages, storeMsg)
      }
    }
    state.messages = {...state.messages}
  },
  /* 改变聊天用户 */
  [types.CHANGE_CURRENT_THREAD_INFO] (state, obj) {
    state.currentThreadID = obj.targetId
    state.currentThreadName = obj.targetId // 待改为从列表获取
    // 改变列表高亮
    state.userList.forEach(function (el) {
      el.active = ''
      if (el.targetId === obj.targetId) {
        el.active = 'active'
      }
    })
  },
  // 发送消息-文本和EMOJI部分
  [types.SEND_MESSAGE] (state, obj) {
    // 添加发送内容到消息列表
    let firstMessage = state.messages['storeid'][0]
    let messageList = state.messages[state.currentThreadID]
    let messageInfo = {
      senderUserId: state.currentUserId, /* 以此参数为判断谁发的 */
      targetId: state.currentThreadID,
      sentTime: new Date().getTime(),
      messageId: state.currentThreadID + parseInt(Math.random() * 1000000 + 10),
      content: {content: obj.msg},
      messageType: '',
      messageUId: ''
    }
    if (messageList) {
      messageList.push(messageInfo)
      state.messages[state.currentThreadID] = messageList
    } else {
      let storeMsg = {
        [state.currentThreadID]: [firstMessage, messageInfo]
      }
      Object.assign(state.messages, storeMsg)
      state.messages = {...state.messages}
    }
  },
  /* 连接成功初始处理 */
  [types.INIT_WINDOW] (state) {
  },
  /* 接收消息 */
  [types.RECEIVE_MESSAGE] (state, obj) {
    // 添加发送内容到消息列表
    obj = obj.msg
    let messageList = state.messages[obj.senderUserId]
    let messageInfo = {
      senderUserId: obj.currentUserId, /* 以此参数为判断谁发的 */
      targetId: state.currentUserId,
      sentTime: obj.sentTime,
      messageId: obj.messageId,
      content: obj.content,
      messageType: obj.messageType,
      messageUId: obj.messageUId
    }
    if (messageList) {
      messageList.push(messageInfo)
      state.messages[obj.senderUserId] = messageList
    } else {
      let storeMsg = {
        [obj.senderUserId]: [messageInfo]
      }
      Object.assign(state.messages, storeMsg)
      state.messages = {...state.messages}
    }
    // console.log(state)
  }
}

