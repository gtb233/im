import * as types from './mutation-types'

export default {
  [types.GET_USER_INFO] (state, userInfo) {
    state.userInfo = userInfo
  },
  [types.GET_USER_TOKEN] (state, userToken) {
    state.userToken = userToken
    state.params.token = userToken
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
  }
}

