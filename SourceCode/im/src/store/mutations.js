import * as types from './mutation-types'

export default {
  [types.GET_USER_INFO] (state, userInfo) {
    state.userInfo = userInfo
  },
  [types.GET_USER_TOKEN] (state, userobj) {
    state.userToken = userobj.userToken
    state.currentUserId = userobj.user
    state.currentThreadID = userobj.currentThreadID
    // console.log(state.params)
  },
  [types.SWITCH_THREAD] (state) { /* 设置融云连接常量 */
    // state.instance = global.RongIMClient.getInstance()
  },
  [types.SET_USER_LIST] (state, obj) { /* 根据融云返回信息设置用户列表 */
    // 获取列表，待改为保存到本地设置一定过期时间
    state.userList = obj.userList
  },
  [types.GET_CURRENT_USER] (state) {
  },
  [types.SET_USER_ID] (state, userId) {
    state.currentUserId = userId
  },
  // 发送消息
  [types.SEND_MESSAGE] (state, obj) {
    console.log(types.SEND_MESSAGE, obj)
  }
}

