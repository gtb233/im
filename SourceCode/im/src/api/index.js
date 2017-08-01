import * as data from './mock-data'
import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

const LATENCY = 16

export function getUserInfo (cb) {
  setTimeout(
    () => { cb(data.userInfo) },
    LATENCY
  )
}

export async function getUserTokenAsync (cb, state) {
  /* 请求获取TOKEN */
  let userToken = ''
  await Vue.http.get(
    state.serverUrl + '/user/get_token?token=GW78829820',
    {name: '这是带参测试'}, {emulateJSON: true}
  ).then(response => {
    let data = response.body
    if (data.code === 200) {
      userToken = data.result.token
      console.log('userToken:  ' + userToken)
    } else {
      console.log(response)
    }
  }, response => {
    alert('连接失败！')
    console.log('请求TOKEN接口失败!')
  })

  await cb(userToken)
}
