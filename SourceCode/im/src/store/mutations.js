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
  [types.SWITCH_THREAD] (state) {
    state.instance = global.RongIMClient.getInstance()
  },
  [types.SET_USER_LIST] (state) {
  }
}

