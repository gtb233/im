import * as api from '../api'
import * as types from './mutation-types'

/* 初始连接 */
export const init = async (store) => {
  /* 连接融云SOCK */
  await rongCloudInit(store)
  /* 获取用户信息 */
  // await getUserInfo(store)
}

/* 取得用户信息 */
export const getUserInfo = async ({ dispatch, commit, state }) => {
  await api.getUserInfo(userInfo => {
    commit(types.GET_USER_INFO, userInfo)
  }, state)
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
  // 连接融云
  await api.rongCloudInit((obj, action) => {
    switch (action) {
      case 'connect':
        commit(types.SET_USER_LIST, obj)
        break
      case 'newMsg':
        commit(types.RECEIVE_MESSAGE, obj)
        break
    }
  }, state)
  /* 获取此对话历史消息,延迟一秒让主程序加载完 */
  // await dispatch('getHistoryMessage')
}

/* 获取历史消息 */
export const getHistoryMessage = async ({state, commit}) => {
  // await api.getHistoryMsgAsync((obj) => {
  //   commit(types.GET_HISTORY_MESSAGE, obj)
  // }, state)
}

/* 发送消息 */
export const sendMessage = async ({ dispatch, commit, state }, obj) => {
  if (state.currentUserId === state.currentThreadID) {
    alert('请选择用户，或至商品页选择商家')
    return false
  }
  console.log(state.currentUserId)
  await api.sendMsg((obj) => {
    commit(types.SEND_MESSAGE, obj)
    commit(types.UPDATE_USERLIST_INFO, obj)
  }, state, obj)
}

/* 改变当前对话用户-列表单击事件触发 */
export const changeCurrentThreadID = async ({commit, state}, obj) => {
  await commit(types.CHANGE_CURRENT_THREAD_INFO, obj)
  // 实时列表
  // await api.getHistoryMsg((obj) => {
  //   commit(types.GET_HISTORY_MESSAGE, obj)
  // }, state)
}

/* 播放语音 */
export const play = ({commit, state}, obj) => {
  api.playVoice(() => {
  }, state, obj)
}

/* 搜索 */
export const changeSearchName = ({commit, state}, obj) => {
  commit(types.SET_SEARCH_NAME, obj)
}

/* 上传图片 */
export const uploadImg = ({commit, state}, obj) => {
  if (state.currentUserId === state.currentThreadID) {
    return false
  }
  api.uploadFile((result) => {
    commit(types.SEND_MESSAGE, result)
  }, state, obj)
}
