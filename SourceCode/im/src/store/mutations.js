import * as types from './mutation-types'

export default {
  [types.GET_USER_INFO] (state, userInfo) {
    state.userInfo = userInfo
  },
  [types.GET_USER_TOKEN] (state, userobj) {
    state.userToken = userobj.userToken
    state.params.token = userobj.userToken
    state.currentUserId = userobj.user
    state.currentThreadID = userobj.currentThreadID
    // console.log(state.params)
  },
  [types.SWITCH_THREAD] (state) { /* 设置融云连接常量 */
    state.instance = global.RongIMClient.getInstance()
  },
  [types.SET_USER_LIST] (state) { /* 根据融云返回信息设置用户列表 */
    // 获取列表，待改为保存到本地设置一定过期时间
    state.instance.getConversationList({
      onSuccess: function (list) {
        // 获取成功
        console.log(list)

        let newDate = new Date()
        let userObj = {}
        state.userList = {} // 重置用户列表

        for (let info of list) {
          let userInfo = {}
          let _targetId = ''

          newDate.setTime(info.sentTime)
          _targetId = info.targetId
          userInfo.targetId = _targetId
          userInfo.sentTime = newDate.toLocaleDateString()
          userInfo.lastMessage = info.latestMessage.content.content
          /* 以下待修改成正确参数 */
          userInfo.userLogo = info.latestMessage.content.user.portraitUri
          userInfo.userName = info.targetId
          userInfo.messagesNumber = 0
          userObj = {
            [_targetId]: userInfo
          }
          Object.assign(state.userList, userObj)
          state.userList = { ...state.userList }
        }
        console.log(state.userList)
      },
      onError: function (error) {
        // 列表获取失败时处理
        console.log(error)
      }
    }, null)
  },
  [types.GET_CURRENT_USER] (state) {
  },
  [types.SET_USER_ID] (state, userId) {
    state.currentUserId = userId
  },
  [types.SEND_MESSAGE] (state, obj) {
    let content = {
      // content:"hello " + encodeURIComponent('π，α，β'),
      content: obj.msg,
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

    let msg = global.RongIMLib.TextMessage(content)
    let start = new Date().getTime()
    global.RongIMLib.sendMessage(state.conversationtype, state.currentThreadID, msg, {
      onSuccess: function (message) {
        console.log('发送文字消息成功', message, start)
      },
      onError: function (errorCode, message) {
        console.log(errorCode)
        console.log('发送文字消息失败', message, start)
      }
    })
  }
}

