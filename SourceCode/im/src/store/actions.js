import * as api from '../api'
import * as types from './mutation-types'

/* 顺序连接 */
export const init = async (store) => {
  /* 连接融云SOCK */
  await rongCloudInit(store)
  /* 获取用户信息，此应该是请求TOKEN时一并返回或去核心取 */
  await getUserInfo(store)
  /* 获取此对话历史消息 */
  // await getHistoryMessage(store)
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
  await api.rongCloudInit((obj, action) => {
    if (action === 'connect') {
      commit(types.SET_USER_LIST, obj)
    }
  }, state)
}

/* 获取历史消息 */
export const getHistoryMessage = async ({state, commit}) => {
  /*
    注意事项：
      1：一定一定一定要先开通 历史消息云存储 功能，本服务收费，测试环境可免费开通
      2：timestrap第二次拉取必须为null才能实现循环拉取
  */
  // const count = 10  // 2 <= count <= 20
  // const timestrap = null // 0, 1483950413013

  // var start = new Date().getTime()
  // await global.RongIMClient.getInstance().getHistoryMessages(state.conversationtype, state.currentThreadID, timestrap, count, {
  //   onSuccess: function (list, hasMsg) {
  //     // // 可通过sort订制其他顺序
  //     // console.log(list.length)
  //     // console.log(hasMsg)
  //     // list.sort(function (a, b) {
  //     //   return a.sentTime < b.sentTime
  //     // })
  //     // console.log('历史消息', list)
  //   },
  //   onError: function (error) {
  //     console.log('获取历史消息失败！', error, start)
  //   }
  // })
}

/* 发送消息 */
export const sendMessage = async ({ commit, state }, obj) => {
  await api.sendMsg(() => {
    commit(types.SEND_MESSAGE, obj)
  }, state, obj)
}
