import * as api from '../api'
import * as types from './mutation-types'

/* 顺序连接 */
export const init = async (store) => {
  // /* 获取用户TOKEN */
  // await getUserToken(store)
  /* 连接融云SOCK */
  await rongCloudInit(store)
  /* 获取用户信息，此应该是请求TOKEN时一并返回或去核心取 */
  await getUserInfo(store)
}

/* 取得用户信息 */
export const getUserInfo = async ({ dispatch, commit }) => {
  await api.getUserInfo(userInfo => {
    commit(types.GET_USER_INFO, userInfo)
  })
}

/* 取得用户融云TOKEN */
export const getUserToken = async ({ dispatch, commit, state }) => {
  await api.getUserTokenAsync((userToken) => {
    commit(types.GET_USER_TOKEN, userToken)
  }, state)
}

/* 连接融云 */
export const rongCloudInit = async ({ dispatch, commit, state }) => {
  // 等待 getUserToken 完成
  await dispatch('getUserToken')
  await api.rongCloudInit((obj) => {
    if (obj.connect) {
      commit(types.SET_USER_LIST, obj)
    }
  }, state)
}

export const sendMessage = async ({ commit, state }, obj) => {
  await api.sendMsg(() => {
    commit(types.SEND_MESSAGE, obj)
  }, state, obj)
}
