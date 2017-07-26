import * as data from './mock-data'
const LATENCY = 16

export function getUserInfo (cb) {
  setTimeout(
    () => { cb(data.userInfo) },
    LATENCY
  )
}
