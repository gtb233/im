import Vue from 'vue'
import VueResource from 'vue-resource'
import * as tool from '../lib/util'
import * as func from '../lib/func'
import UploadClient from '../lib/init'
import $ from 'jquery'

/**
 * 各种api链接
 */

let RongIMLib = global.RongIMLib
let RongIMClient = global.RongIMLib.RongIMClient

Vue.use(VueResource)

const conversationtype = RongIMLib.ConversationType.PRIVATE

// Vue.http.options.emulateJSON = true // 需要跨域时使用

/**
 * 取得盖讯通用户信息
 * @param string userId 盖讯通ID
 */
export async function getUserInfo (state, userId) {
  return new Promise((resolve, reject) => {
    const params = {
      userId: userId
    }
    Vue.http.post(
      state.serverUrl + 'api/getUserInfo',
      params,
      { emulateJSON: true }
    ).then(response => {
      if (state.debug) console.log('用户信息获取成功！', response)
      resolve(response)
    }, response => {
      console.log('会话列表更新失败！')
      // reject('获取用户信息失败！')
    })
  })
}

/*
 * 添加聊天用户到列表
 * msgObj 格式 参考消息列表
 */
export async function setUserList (cb, state, obj, isReceive = 0) {
  let messagesNumber = 0
  if (isReceive || obj.targetId !== state.currentThreadID) {
    await state.userList.forEach(function (el) {
      if (el.targetId === obj.targetId) {
        messagesNumber = el.messagesNumber + 1
      }
    })
  }
  let info = {}
  if (!obj.gwCode) {
    if (!state.currentThreadGWCode) {
      await getUserInfo(state, obj.message.targetId).then((response) => {
        info = response.body
      })
      obj.gwCode = info.userInfo.code ? info.userInfo.code : info.entity.userName
    }
    obj.gwCode = obj.gwCode ? obj.gwCode : state.currentThreadGWCode
  }

  const params = {
    userId: state.currentUserId,
    gwCode: obj.gwCode, /* GW号 */
    targetId: obj.targetId, /* 目标ID */
    userLogo: obj.userLogo, /* 头像 */
    userName: obj.nickname, /* 商铺名称-改用昵称 */
    lastMessage: obj.lastMessage, /* 最后一条消息文本内容 */
    lastMsgType: obj.message.messageType, /* 消息类型 */
    messagesNumber: parseInt(messagesNumber), /* 消息数 */
    message: {
      senderUserId: obj.message.senderUserId, /* 以此参数为判断谁发的  */
      targetId: obj.message.targetId,
      sentTime: obj.message.sentTime,
      messageId: obj.message.messageId,
      content: {
        content: obj.message.content.content,
        content_back: obj.message.content.content_back ? obj.message.content.content_back : '', // 用于保存音频图片之类的原始文件数据
        imageUri: obj.message.content.imageUri ? obj.message.content.imageUri : '',
        messageName: obj.message.content.messageName // 类型
      },
      messageType: obj.message.messageType,
      messageUId: obj.message.messageUId,
      sentStatus: obj.message.sentStatus
    } /* 当前消息内容，用于记录消息历史 */
  }
  if (state.debug) console.log('用户会话列表发送参数：', params)
  await Vue.http.post(
    state.serverUrl + 'api/setUserList',
    params,
    { emulateJSON: true }
  ).then(response => {
    console.log('会话列表更新成功！')
  }, response => {
    console.log('会话列表更新失败！')
  })
}

/* 获取会话列表 */
let getUserList = (cb, state) => {
  // 新获取方法：
  const params = {
    userId: state.currentUserId
  }
  Vue.http.post(
    state.serverUrl + 'api/getUserList',
    params,
    { emulateJSON: true }
  ).then(response => {
    let list = response.body
    let userList = []
    // 获取成功
    if (state.debug) console.log('用户列表:', list)

    let newDate = new Date()
    try {
      for (let info of list) {
        let userInfo = {}
        let _targetId = ''

        newDate.setTime(info.sentTime)
        _targetId = info.targetId
        if (_targetId === '验证消息') {
          continue // 只展示用户
        }
        userInfo.targetId = _targetId
        userInfo.sentTime = tool.changeTime(newDate.toLocaleDateString())
        // 音频图片时 与消息窗口处理有差异，处理图标便可
        userInfo.lastMessage = func.checkUserlistMsg(info.lastMessage, info.lastMsgType)
        userInfo.active = ''
        if (state.currentThreadID === _targetId) {
          userInfo.active = 'active'
        }
        /* 盖讯通无任何数据，只能自己服务端添加时加上些字段以便作用 */
        userInfo.userLogo = info.userLogo
        userInfo.userName = info.userName
        userInfo.lastMsgType = info.lastMsgType
        userInfo.gwCode = info.gwCode
        userInfo.messagesNumber = info.messagesNumber
        userInfo.uniKey = parseInt(Math.random() * 1000000 + 10) // 辅助用，当数据异常时
        userList.push(userInfo)
      }
    } catch (e) {
      console.log('用户列表数据异常')
      userList = []
    }
    cb(userList)
  }, response => {
    console.log('用户列表获取失败！')
  })

  // 融云获取会话列表 -- 弃用，改为服务端保存.功能暂时保留
  // RongIMClient.getInstance().getConversationList({
  //   onSuccess: function (list) {
      // let userList = []
      // // 获取成功
      // console.log('userList:', list)

      // let newDate = new Date()

      // for (let info of list) {
      //   let userInfo = {}
      //   let _targetId = ''
      //   let _content = info.latestMessage.content

      //   newDate.setTime(info.sentTime)
      //   _targetId = info.targetId
      //   if (_targetId === '验证消息') {
      //     continue // 只展示用户
      //   }
      //   userInfo.targetId = _targetId
      //   userInfo.sentTime = newDate.toLocaleDateString()
      //   // 音频图片时 与消息窗口处理有差异，处理图标便可
      //   userInfo.lastMessage = _content.content
      //   userInfo.active = ''
      //   if (state.currentThreadID === _targetId) {
      //     userInfo.active = 'active'
      //   }
      //   /* 盖讯通无任何数据，只能自己服务端添加时加上些字段以便作用 */
      //   userInfo.userLogo = '' // info.latestMessage.senderUserId !== state.currentUserId ? _content.user.portraitUri : _content.extra.portraitUri
      //   userInfo.userName = _targetId // info.latestMessage.senderUserId !== state.currentUserId ? _content.user.name : _content.extra.name
      //   userInfo.messagesNumber = 0
      //   userList.push(userInfo)
      // }
      // cb(userList)
  //   },
  //   onError: function (error) {
  //     // 列表获取失败时处理
  //     console.log(error)
  //   }
  // }, null)
}

/**
 * 请求获取TOKEN
 * @param cb
 * @param state VUE 对象
 * @param cb2 TOKEN失效时修改侧边栏提示
 */
export async function getUserToken (cb, state, cb2) {
  let userToken = ''
  let get = tool.urlParse()
  let user = get['user']
  let currentThreadID = get['storeid']
  let isQuery = get['isQuery']
  if (!user || !currentThreadID) {
    alert('用户ID与商家ID数据异常！')
    console.log('用户ID与商家ID数据异常！')
    return false
  }
  const params = {
    userId: user,
    name: user,
    token: get['token'],
    storeId: currentThreadID
  }

  await Vue.http.post(
    state.serverUrl + 'api/gxtToken',
    params,
    { emulateJSON: true }
  ).then(response => {
    let data = response.body

    if (state.debug) console.log('service return:', data)

    if (data.resultCode === '0001') {
      // 检查商家
      if (data.resultData.togw === 'null' || data.resultData.togw === null) {
        alert('商家不存在，请核对！')
        console.log('商家不存在')
      }
      // 检查是否初始客服号，若是则替换提示语
      if (data.resultData.togw.userId === data.resultData.fromgw.userId) {
        data.resultData.togw.userInfo.userName = '请选择要咨询的商家'
      }
      userToken = data.resultData.rongToken // 融云TOKEN
      user = data.resultData.fromgw // 变更为用户信息对象
      currentThreadID = data.resultData.togw // 变更为商家信息对象
    } else if (data.resultCode === '403') {
      // alert(data.tag + '!请重新进入!')
      console.log('获取Token:', data)
    } else {
      console.log('获取Token 其他错误:', data)
      cb2()
      return false
    }
  }, response => {
    alert('请求连接失败，请刷新页面重试！')
    console.log('请求TOKEN失败!')
    return false
  })
  await cb({ userToken, user, currentThreadID, isQuery })
}

/**
 * 融云初始化
 *
 * @param {*} cb
 * @param {*} state
 */
export async function rongCloudInit (cb, state) {
  let appKey = state.appKey
  if (state.debug) console.log('公有云:' + appKey)
  await RongIMLib.RongIMClient.init(appKey)
  await global.RongIMLib.RongIMEmoji.init() // 表情初始化
  await global.RongIMLib.RongIMVoice.init() // 声音初始化

  // 返回数据
  let result = {
    connect: false,
    newMsg: null,
    userList: null,
    userInfo: {},
    emojis: []
  }
  // 旧 验证新消息方法，已弃用
  /* if (state.isQuery) {
    RongIMClient.getInstance().hasRemoteUnreadMessages(state.userToken, {
      onSuccess: function (hasMessage) {
        if (hasMessage) {
          console.log('有新消息')
          // 修改商城代码，添加消息提示图标
        } else {
          // 没有未读的消息
          console.log('无新消息')
        }
      },
      onError: function (err) {
        // 错误处理...
        console.log(err)
      }
    })
  } */

  // 连接状态监听器
  RongIMClient.setConnectionStatusListener({
    onChanged: function (status) {
      switch (status) {
        case RongIMLib.ConnectionStatus.CONNECTED:
          result.connect = true // 改为使用额外参数，防止重复调用
          getUserList((userList) => {
            result.userList = userList
            cb(result, 'connect')
          }, state)
          // 返回表情 此处回调处理时间会早于用户列表
          result.emojis = RongIMLib.RongIMEmoji.emojis
          cb(result, 'connect')
          break
        case RongIMLib.ConnectionStatus.CONNECTING:
          console.log('正在链接')
          break
        case RongIMLib.ConnectionStatus.DISCONNECTED:
          console.log('断开连接')
          break
        case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
          console.log('其他设备登录')
          // alert('其他页面登录')
          let index = parent.layer.getFrameIndex(window.name) // 先得到当前iframe层的索引
          if (index) window.parent.msgManage = true
          parent.layer.close(index) // 再执行关闭

          // window.location.href = 'about:blank' // 兼容chrome 添加处理
          // 独立页时，有父类时可直接使用下面的
          // window.opener = null
          // window.open('', '_self', '')
          // window.close()
          break
        case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
          console.log('域名不正确')
          break
        case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
          console.log('网络不可用')
          break
      }
    }
  })

  // 接收消息 如果有未接收的消息很多太快可能存在展示异常，待处理
  RongIMClient.setOnReceiveMessageListener({
    onReceived: async function (message) {
      if (state.debug) console.log('接收到的消息', message)
      let messageBack = tool.deepCopy(message) // 注意对象引用的干扰

      // 输入中状态判断,红包状态判断
      if (message.messageType === RongIMClient.MessageType.TextMessage ||
        message.messageType === RongIMClient.MessageType.VoiceMessage ||
        message.messageType === RongIMClient.MessageType.ImageMessage) {
        if (message.senderUserId !== state.currentUserId) {
          // 处理商城图标提示语--商城处理部分
          let msgNum = window.parent.isNewMessage >= 1 ? window.parent.isNewMessage : 0
          window.parent.isNewMessage = msgNum + 1
          if (window.parent.msgManage) {
            $('#gx-socket-message', window.parent.document).html(window.parent.isNewMessage + '条新信息')
          }
        }

        let info = {}
        await getUserInfo(state, message.targetId).then((response) => {
          info = response.body
        })
        result.userInfo.userHead = tool.imageUrlConvert(info.userInfo.userHead)
        result.userInfo.userId = message.senderUserId
        result.userInfo.userName = info.userInfo.userName ? info.userInfo.userName : info.entity.userName
        result.userInfo.nickname = info.userInfo.nickname ? info.userInfo.nickname : info.entity.userName
        result.userInfo.gwCode = info.userInfo.code ? info.userInfo.code : info.entity.userName
        message = func.filterMessage(message) // 引用类型
        result.msg = message
        // 改为需要的地方添加处理
        // result.msg.content.content_back = func.checkUserlistMsg(result.msg.content.content_back, result.msg.messageType)

        // 记录会话列表
        setUserList(() => {}, state, {
          targetId: message.targetId, /* 目标ID */
          userLogo: result.userInfo.userHead, /* 头像 */
          userName: result.userInfo.userName, /* 名称 */
          nickname: result.userInfo.nickname, // 昵称
          gwCode: result.userInfo.gwCode,
          lastMessage: func.checkUserlistMsg(result.msg.content.content_back, result.msg.messageType), /* 最后一条消息内容 */
          messagesNumber: 0, /* 消息数 */
          message: messageBack
        })

        // 更新消息框
        cb(result, 'newMsg')
      } else if (message.messageType === 'UnknownMessage') {
        console.log('红包信息，请在手机端查收！')
      } else {
        console.log('输入中。。')
      }
    }
  })

  /* 开始连接 */
  RongIMClient.connect(state.userToken, {
    onSuccess: function (userId) {
      console.log('链接成功，用户id：' + userId)
    },
    onTokenIncorrect: function () {
      console.log('token无效,连接失败!')
      // alert('连接失败，请刷新页面重试！')
      // 此处可添加重新获取
    },
    onError: function (errorCode) {
      console.log('=============================================')
      console.log(errorCode)
    }
  })
}

/**
 * 发送文本消息
 * 发送不做 链接跳转功能，只在接收方处理
 */
export async function sendMsg (cb, state, obj) {
  if (obj.msg == null || obj.msg === '' || obj.msg === undefined) {
    return false
  }
  // 去除尾部空行
  obj.msg = obj.msg.replace(/[ | ]*\n/g, '\n')
  let msgContent = RongIMLib.RongIMEmoji.symbolToEmoji(obj.msg) // 用于发送的注意保持干净
  let currentThreadID = state.currentThreadID
  let content = {
    content: msgContent, // 名称 转 Emoji 消息体里必须使用原生 Emoji 字符
    extra: { // 跟盖讯通同步，此不再传数据
    }
  }

  let msg = new RongIMLib.TextMessage(content)
  let start = new Date().getTime()
  RongIMClient.getInstance().sendMessage(conversationtype, currentThreadID, msg, {
    onSuccess: function (message) {
      if (state.debug) console.log('发送文字消息成功', message)
      // 更新用户列表数据
      setUserList(cb, state, {
        targetId: state.currentThreadID, /* 目标ID */
        userLogo: state.currentThreadLogo, /* 头像 */
        userName: state.currentThreadName, /* 商铺名称 */
        nickname: state.currentThreadName,
        lastMessage: msgContent,
        message: message /* 保存消息到历史 */
      })
      // 发送成功处理
      obj.msg = RongIMLib.RongIMEmoji.symbolToHTML(obj.msg) // 对话框展示数据处理
      obj.msgContent = func.checkUserlistMsg(message.content.content, message.messageType) // 用户列表展示 数据处理
      obj.currentThreadID = currentThreadID
      cb(obj)
    },
    onError: function (errorCode, message) {
      console.log(errorCode)
      console.log('发送文字消息失败', message, start)
    }
  })
}

/* 获取历史消息，初始化时延迟一秒执行 */
export function getHistoryMsgAsync (cb, state) {
  /*
    注意事项：
      1：一定一定一定要先开通 历史消息云存储 功能，本服务收费，测试环境可免费开通
      2：timestrap第二次拉取必须为null才能实现循环拉取
  */
  setTimeout(() => {
    getHistoryMsg(cb, state)
  }, 1000)
}

/* 获取历史消息，实时 */
export const getHistoryMsg = async (cb, state) => {
  // 最新十条
  // const count = 10  // 2 <= count <= 20
  // const timestrap = new Date().getTime() // 0, 1483950413013 //null 时第二次加载是遍历查询
  let result = {
    list: [],
    hasMsg: false
  }
  const params = {
    userId: state.currentUserId,
    targetId: state.currentThreadID
  }
  await Vue.http.post(
    state.serverUrl + 'api/getHistoryMsg',
    params,
    { emulateJSON: true }
  ).then(response => {
    if (state.debug) console.log('历史消息', response.body)
    let list = response.body
    for (let key in list) {
      list[key] = JSON.parse(list[key])
      list[key].uniKey = parseInt(Math.random() * 1000000 + 10)
      list[key] = func.filterMessage(list[key])
    }
    result.list = list
    result.hasMsg = false
    cb(result)
  }, response => {
    console.log('历史消息获取失败')
  })

  // RongIMClient.getInstance().getHistoryMessages(conversationtype, state.currentThreadID, timestrap, count, {
  //   onSuccess: function (list, hasMsg) {
  //     // hasMsg为boolean值，如果为true则表示还有剩余历史消息可拉取，为false的话表示没有剩余历史消息可供拉取。
  //     // 可通过sort订制其他顺序
  //     // list.sort(function (a, b) {
  //     //   return a.sentTime > b.sentTime
  //     // })

  //     if (state.debug) console.log('历史消息', list)

  //     // 数据处理 RongIMLib.RongIMEmoji.emojiToHTML(message) unicode EMOJI转为HTML
  //     for (let key in list) {
  //       list[key] = func.filterMessage(list[key])
  //     }
  //     result.list = list
  //     result.hasMsg = hasMsg
  //     cb(result)
  //   },
  //   onError: function (error) {
  //     console.log('获取历史消息失败！', error, timestrap)
  //   }
  // })
}

/* 播放语音 */
export const playVoice = (cb, state, obj) => {
  for (let msg of state.messages[state.currentThreadID]) {
    let debug = false
    if (msg.messageType === 'VoiceMessage' || debug === true) {
      let audioFile = msg.content.content_back // 格式为 AMR 格式的 base64 码
      // 测试数据
      // let audioFile = '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'
      // let duration = audioFile / 1024
      // 停播 功能效果不是很好，舍弃
      // if (state.currentVoiceFile !== '') {
      //   RongIMLib.RongIMVoice.stop(state.stopPlay)
      // }

      // 播放选择的
      if (obj.messageId === msg.messageId) {
        let duration = msg.content.duration
        RongIMLib.RongIMVoice.preLoaded(audioFile, function () {
          RongIMLib.RongIMVoice.play(audioFile, duration)
        })
      }
    }
  }
}

/* 发送图片 */
export const uploadFile = (cb, state, obj) => {
  // 检查文件格式
  if (state.uploadFileTypes.indexOf(obj._file.type) === -1) {
    alert('请上传正确的图片文件！')
    return false
  }

  // 配置
  let config = {
    domain: 'http://upload.qiniu.com',
    fileType: RongIMLib.FileType.IMAGE,
    getToken: function (callback) { // 上传文件TOKEN，具体用处未知
      RongIMClient.getInstance().getFileToken(this.fileType, {
        onSuccess: function (data) {
          callback(data.token)
        },
        onError: function (error) {
          console.log('getFileToken error:' + error)
        }
      })
    }
  }
  // 定义上传回调
  let callback = {
    onError: function (errorCode) {
      // 上传失败处理
      console.log('upload error!', errorCode)
    },
    onProgress: function (loaded, total) {
      // 进行中
      console.log(total + 'total上传中：' + loaded)
    },
    onCompleted: function (data) {
      // 成功处理
      sendImage(data, state, cb)
    }
  }

  let initType = {
    file: function (_file) {
      config.fileType = RongIMLib.FileType.FILE
      UploadClient.initFile(config, function (uploadFile) {
        uploadFile.upload(_file, callback)
      })
    },
    image: function (_file) {
      UploadClient.initImage(config, function (uploadFile) {
        uploadFile.upload(_file, callback)
      })
    }
  }

  // 上传
  initType[getFileType(obj._file.name)](obj._file)
}

/* 更新用户列表消息数提示 */
export const changeMsgNumber = (state, obj) => {
  const params = {
    userId: state.currentUserId,
    targetId: obj.targetId
  }
  Vue.http.post(
    state.serverUrl + 'api/changeMsgNumber',
    params,
    { emulateJSON: true }
  ).then(response => {
    if (state.debug) console.log('提示值更新成功！')
  }, response => {
    console.log('消息提示更新失败！')
  })
}

/* 上传完成处理 */
const sendImage = async (data, state, cb) => {
  data.fileType = getFileType(data.name)
  await urlItem[data.fileType](data)

  let currentThreadID = state.currentThreadID

  // 暂时延迟一秒，await 不起作用
  setTimeout(() => {
    let content = {
      imageUri: data.downloadUrl,
      content: data.thumbnail,
      extra: { // 与盖讯通保持结构一致
      }
    }
    let msg = new RongIMLib.ImageMessage(content)
    let obj = {}
    RongIMClient.getInstance().sendMessage(conversationtype, currentThreadID, msg, {
      onSuccess: async function (message) {
        if (state.debug) console.log('sendImag', message)
        let messageBack = message /* 记录历史消息 */
        // 添加 到消息框
        message = await func.filterMessage(message)
        obj.msg = message.content.content
        await cb(obj)
        // 更新用户列表数据
        setUserList(cb, state, {
          targetId: state.currentThreadID, /* 目标ID */
          userLogo: state.currentThreadLogo, /* 头像 */
          userName: state.currentThreadName, /* 商铺名称 */
          nickname: state.currentThreadName,
          lastMessage: message.content.content_back,
          message: messageBack
        })
      },
      onError: function (errorCode, message) {
        console.log('图片发送失败！')
      }
    })
  }, 1000)
}
/* 检查上传文件类型 */
let getFileType = function (filename) {
  // 默认支持两种图片格式，可自行扩展
  let imageType = {
    'jpg': 1,
    'png': 2
  }
  let index = filename.lastIndexOf('.') + 1
  let type = filename.substring(index)
  return type in imageType ? 'image' : 'file'
}
/* 获取上传后的图片地址 */
let urlItem = {
  file: function (data) {
    let fileType = RongIMLib.FileType.FILE
    RongIMClient.getInstance().getFileUrl(fileType, data.filename, data.name, {
      onSuccess: function (result) {
        data.downloadUrl = result.downloadUrl
        return data
      },
      onError: function (error) {
        console.log(error)
      }
    })
  },
  image: function (data) {
    let fileType = RongIMLib.FileType.IMAGE
    RongIMClient.getInstance().getFileUrl(fileType, data.filename, null, {
      onSuccess: function (result) {
        data.downloadUrl = result.downloadUrl
        // console.log(data)
        return data
      },
      onError: function (error) {
        console.log(error)
      }
    })
  }
}

