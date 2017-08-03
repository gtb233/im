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
    state.serverUrl + 'api/token?userId=GW78829820&name=sherman&portraitUri=gemall_20170718171031_82ee053d-dbbb-42a9-a1c3-f12247df36b0.jpg',
    {name: '这是带参测试'}, {emulateJSON: true}
  ).then(response => {
    let data = response.body
    if (data.code === 200) {
      userToken = data.token
      console.log('userToken:  ' + userToken)
    } else {
      console.log(response)
    }
  }, response => {
    alert('请求连接失败，请刷新页面重试！')
    console.log('请求TOKEN接口失败!')
  })

  await cb(userToken)
}
