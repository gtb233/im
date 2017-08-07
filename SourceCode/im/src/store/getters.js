export const userInfo = state => state.userInfo

export const currentThread = state => {
  return state.currentThreadID
    ? state.threads[state.currentThreadID]
    : {}
}

export const getCurrentUserMessage = state => {
  if (!state.messages[state.currentThreadID]) {
    return state.messages['storeid'] // 默认内容
  } else {
    return state.messages[state.currentThreadID]
  }
}
