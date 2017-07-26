import * as api from '../api'
import * as types from './mutation-types'

export const getUserInfo = ({commit}) => {
  api.getUserInfo(userInfo => {
    commit(types.GET_USER_INFO, userInfo)
  })
}
