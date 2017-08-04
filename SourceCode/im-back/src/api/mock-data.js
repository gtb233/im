export const userInfo = {
  userId: '1',
  username: '测试用户',
  gaiNumber: 'GW123456',
  thumb: 'http://qlogo2.store.qq.com/qzone/519430301/519430301/50?1495187229',
  token: 'fgfdhdfhdfgh4564dg54sdg',
  userLevel: '正式会员'
}

export const messages = [
  {
    id: 'm_1',
    threadID: 't_1',
    username: 'Bill',
    text: 'Hey Jing, want to give a Flux talk at ForwardJS?',
    timestamp: Date.now() - 99999
  },
  {
    id: 'm_2',
    threadID: 't_1',
    username: userInfo.username,
    text: 'Hey Jing, want to give a Flux talk at ForwardJS?',
    timestamp: Date.now() - 99999
  }
]
