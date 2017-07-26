// import Vue from 'vue'
import * as types from './mutation-types'

export default {
  [types.GET_USER_INFO] (state, userInfo) {
    state.userInfo = userInfo
  }
}

