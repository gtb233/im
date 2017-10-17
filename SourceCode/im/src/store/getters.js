export const userInfo = state => state.userInfo

/* 侧边用户列表 */
export const getUserList = (state, getters) => {
  let userList = []
  if (state.searchName !== '') {
    for (let user of state.userList) {
      let reg = new RegExp(state.searchName, 'i')
      let searchStr = user.userName + user.gwCode
      let result = searchStr.match(reg)
      if (result) {
        userList.push(user)
      }
    }
  } else {
    userList = state.userList
  }
  // console.log(userList)
  return userList
}
/* 对话框消息 */
export const getCurrentUserMessage = state => {
  if (!state.messages[state.currentThreadID]) {
    return state.messages['storeid'] // 默认内容
  } else {
    return state.messages[state.currentThreadID]
  }
}

