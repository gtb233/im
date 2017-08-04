import * as types from './mutation-types'

export default {
  /* 取行用户信息 */
  [types.GET_USER_INFO] (state, userInfo) {
    state.userInfo = userInfo
  },
  /* 设置用户融云TOKEN */
  [types.GET_USER_TOKEN] (state, userobj) {
    state.userToken = userobj.userToken
    state.params.token = userobj.userToken
    state.currentUserId = userobj.user
    state.currentThreadID = userobj.currentThreadID
  },
  /* 设置融云连接实例 */
  [types.SWITCH_THREAD] (state) {
    state.instance = global.RongIMClient.getInstance()
  },
  /* 根据融云返回信息设置用户列表 */
  [types.SET_USER_LIST] (state) {
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
          let _targetId = info.targetId

          newDate.setTime(info.sentTime)
          userInfo.targetId = _targetId
          userInfo.sentTime = newDate.toLocaleDateString()
          userInfo.lastMessage = info.latestMessage.content.content
          /* 以下待修改成正确参数 */
          userInfo.userLogo = info.latestMessage.content.user.portraitUri
          userInfo.userName = info.targetId
          userInfo.messagesNumber = 0
          userInfo.active = ''
          if (state.currentThreadID === userInfo.targetId) {
            userInfo.active = 'active'
          }
          userObj = {
            [_targetId]: userInfo
          }
          Object.assign(state.userList, userObj) // 合并数组
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
  /* 连接成功初始处理 */
  [types.SET_INIT_WINDOW] (state) {
    // 初始发送一条信息给用户或列表添加提示信息（此为本地信息）
  },
  /* 发送信息后数据处理 */
  [types.SEND_MESSAGE] (state, payload) {
  }
}

