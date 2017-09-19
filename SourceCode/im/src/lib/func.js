// 只使用固定方法不变更状态
let RongIMLib = global.RongIMLib
let RongIMClient = global.RongIMLib.RongIMClient

/**
 * 根据类型处理用户列表信息展示
 * @param string lastMessage 用户消息内容
 * @param string msgType 用户消息类型
 * @param Object rongMsgType 融云消息类型列表对象
 */
export function checkUserlistMsg (lastMessage, msgType) {
  let result = lastMessage
  switch (msgType) {
    case RongIMClient.MessageType.TextMessage:
      result = RongIMLib.RongIMEmoji.emojiToSymbol(lastMessage)
      break
    case RongIMClient.MessageType.VoiceMessage:
      result = '[语音]'
      break
    case RongIMClient.MessageType.ImageMessage:
      result = '[图片]'
      break
    default:
  }
  return result
}

/**
 * 消息处理用于消息框展示 分为：文本（带表情）、音频（展示图片可点击）、文件图片（展示图片）
 * content_back 用于保存原始数据
 * content 保存页面展示数据
 */
export const filterMessage = (message) => {
  switch (message.messageType) {
    /* 文本消息（带原生Emoji） */
    case RongIMClient.MessageType.TextMessage:
      // HTML形式
      message.content.content_back = message.content.content

      try {
        // 替换掉HTML tag
        message.content.content = message.content.content.replace(/<\/?[^>]*>/g, '')
        /*
         * 商城URL添加跳转功能
         * 地址以http/https/ftp/ftps开头
         * 地址不能包含双字节符号或非链接特殊字符
         * /^ (https|ftps) :// ( [\w -]+ ( \. [\w - ]+)* / )* [\w - ]+ ( \. [\w - ]+)* /{0,1} ( ? ([\w -.,@?^=%&:/~+# ]*)+ ){0,1} $/
         * 所有URL /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/
         * 商城URL /^((ht|f)tps?):\/\/(.+)\.g\-emall\.com\/([\w\-]+([\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/
         */
        let match = /^((ht|f)tps?):\/\/(.+)\.g\-emall\.com\/([\w\-]+([\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/
        let matchResult = message.content.content.match(match)
        // console.log(matchResult)

        if (matchResult) {
          message.content.content = message.content.content.replace(
            matchResult[0],
            '<a href="' + matchResult[0] + '" target="_blank">' + matchResult[0] + '</a>'
          )
        }
      } catch (e) {
        console.log(e)
      }

      message.content.content = RongIMLib.RongIMEmoji.emojiToHTML(message.content.content)
      // 处理成原生EMOJI 兼容性有问题
      // message.content.content = RongIMLib.RongIMEmoji.emojiToSymbol(message.content.content)
      // message.content.content = RongIMLib.RongIMEmoji.symbolToEmoji(message.content.content)
      break

    /* 音频 */
    case RongIMClient.MessageType.VoiceMessage:
      message.content.content_back = message.content.content
      message.content.content = '<img src="http://mu6.bdstatic.com/static/images/page/index/icon-fm.png" />' // 待修改成自己的音乐GIF图标
      break

    /* 文件（图片） */
    case RongIMClient.MessageType.ImageMessage:
      // message.content.content => 图片缩略图 base64。
      // message.content.imageUri => 原图 URL。
      // 具体待处理
      message.content.content_back = message.content.content // 暂存缩略图 base64, 未做放大，直接使用原图
      message.content.content = '<img src="' + message.content.imageUri + '" />'
      break

    /* 图文(未知) */
    case RongIMClient.MessageType.RichContentMessage:
      // message.content.content => 文本消息内容。
      // message.content.imageUri => 图片 base64。
      // message.content.url => 原图 URL。
      break
    case RongIMClient.MessageType.InformationNotificationMessage:
        // do something...
      break
    case RongIMClient.MessageType.ContactNotificationMessage:
        // do something...
      break
    case RongIMClient.MessageType.ProfileNotificationMessage:
        // do something...
      break
    case RongIMClient.MessageType.CommandNotificationMessage:
        // do something...
      break
    case RongIMClient.MessageType.CommandMessage:
        // do something...
      break
    case RongIMClient.MessageType.UnknownMessage:
        // do something...
      break
    default:
  }
  return message
}
