import * as types from './mutation-types'

export default {
  /* 获取用户信息 */
  [types.GET_USER_INFO] (state, userInfo) {
    // state.userInfo = userInfo
  },
  /* 获取用户TOKEN，设置用户ID、商家ID */
  [types.GET_USER_TOKEN] (state, userobj) {
    state.userToken = userobj.userToken
    state.currentUserId = userobj.user.userId
    // 商家信息
    state.currentThreadID = userobj.currentThreadID.userId
    state.currentThreadName = userobj.currentThreadID.userNickname
    state.currentThreadLogo = userobj.currentThreadID.userHead ? state.userImgUrl + userobj.currentThreadID.userHead : ''
    // 添加用户信息
    state.userInfo.thumb = userobj.user.userHead ? state.userImgUrl + userobj.user.userHead : ''
    state.userInfo.username = userobj.user.userNickname
    state.userInfo.userLevel = '正式会员'
  },
  /* 根据融云返回信息设置用户列表 */
  [types.SET_USER_LIST] (state, obj) {
    state.emojis = obj.emojis
    state.userList = obj.userList ? obj.userList : []
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
    state.currentThreadName = obj.userName // 可能需要改为从列表获取
    state.currentThreadLogo = obj.userLogo // 可能需要改为从列表获取
    // 改变列表高亮
    state.userList.forEach(function (el) {
      el.active = ''
      if (el.targetId === obj.targetId) {
        el.active = 'active'
        el.messagesNumber = 0
      }
    })
  },
  // 发送消息后消息列表处理-文本和EMOJI，发送图片也使用此
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
    // 添加发送内容到消息列表 存在
    obj = obj.msg
    let newDate = new Date()
    // 更新对话框内容
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
    // 防此初始化时过快处理报错，延迟执行。更新列表数据,并在列表无此用户时添加用户到列表
    newDate.setTime(obj.sentTime)
    setTimeout(() => {
      let isExist = 0
      state.userList.forEach(function (el) {
        if (el.targetId === obj.targetId) {
          el.lastMessage = obj.content.content_back  // 设置内容，非对象结构
          el.sentTime = newDate.toLocaleDateString()
          if (el.targetId !== state.currentThreadID) {
            el.messagesNumber += 1
          }
          isExist = 1
        }
      })
      if (!isExist) {
        let user = {
          targetId: obj.senderUserId, /* 目标ID */
          userLogo: '', /* 头像 */
          userName: obj.senderUserId, /* 商铺名称 */
          lastMessage: obj.content.content_back, /* 最后一条消息内容 */
          messagesNumber: 1, /* 消息数 */
          sendTime: newDate.toLocaleDateString(), /* 最后一条消息时间 */
          active: ''
        }
        state.userList.push(user)
      }
    }, 500)
  },
  /* 修改搜索字段 */
  [types.SET_SEARCH_NAME] (state, obj) {
    state.searchName = obj.val
  },
  /* 更新侧边栏消息提示数据 */
  [types.UPDATE_USERLIST_INFO] (state, obj) {
    let newDate = new Date()
    newDate.setTime(newDate.getTime())
    state.userList.forEach(function (el) {
      if (el.targetId === obj.currentThreadID) {
        el.lastMessage = obj.msgContent
        el.sentTime = newDate.toLocaleDateString()
      }
    })
  }
}

