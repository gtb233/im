export const userInfo = state => state.userInfo

export const currentThread = state => {
  return state.currentThreadID
    ? state.threads[state.currentThreadID]
    : {}
}

export const getCurrentUserMessage = state => {
  return state.messages.storeid
}
