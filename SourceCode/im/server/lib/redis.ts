import * as redis from 'redis';
import config from '../config';

const client = redis.createClient(config.redis.PORT, config.redis.HOST, config.redis.OPTIONS)

// 连接成功
client.on('connect', function () {
  console.log('connect');
});

// 当与redis服务器连接成功后会触发这个事件，此时表示已经准备好接收命令
client.on('ready', function (err) {
  console.log('ready');
});

client.on("error", function (err) {
  console.log("Error " + err);
});

/**
 * 请求参数
 */
export class setRst {
  public targetId: string;
  public lastMessage: string;
  public sentTime: string;
  public messagesNumber: number;
  public userLogo: string;
  public userName: string;
}
/**
 * 返回数据
 */
export class getRpn {
  public targetId: string;
  public lastMessage: string;
  public sentTime: string;
  public messagesNumber: number;
  public userLogo: string;
  public userName: string;
}

/**
 * 获取历史会话列表
 * key: "gxt_emall_IM_userlist_" + userid 盖讯通融云处的ID
 */
export async function getUserList(userId: string) {
  let result: any = null
  const key = "gxt_emall_IM_userlist_" + userId
  await client.get(key, function(err, reply) {
    console.log(reply)
    try{
      return JSON.parse(reply) as getRpn
    }catch(e){
      return null
    }
  })
}

/**
 * 设置会话列表
 * key: "gxt_emall_IM_userlist_" + userid 盖讯通融云处的ID
 * 过期时间暂定一个月
 */
export function setUserList(userId: string, rst: setRst) {
  console.log(rst)
  const key = "gxt_emall_IM_userlist_" + userId
  const value = {
    targetId: rst.targetId, /* 目标ID */
    userLogo: rst.userLogo, /* 头像 */
    userName: rst.userName, /* 商铺名称 */
    lastMessage: rst.lastMessage, /* 最后一条消息内容 */
    messagesNumber: 0, /* 消息数 */
    sendTime: new Date().getTime()
  }
  client.set(key, JSON.stringify(value), function(err, reply) {
    console.log(reply)
  })
}
