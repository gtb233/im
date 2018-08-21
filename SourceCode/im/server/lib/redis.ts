import * as redis from 'redis';
import config from '../config';
import * as q from 'q';
import * as tool from './util'

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
  public gwCode: string;
  public lastMessage: string;
  public lastMsgType: string;
  public sentTime: string;
  public messagesNumber: number;
  public userLogo: string;
  public userName: string;
  public message?: any;
}

/**
 * 历史消息请求体
 */
export class setHistoryMsgRst {
  public senderUserId: string; /* 发送用户 */
  public targetId: string; /* 接收用户 */
  public sentTime: string;
  public messageId: number;
  public content: contentRst;
  public messageType: string;
  public messageUId: string;
  public sentStatus: any;
}

class contentRst {
  public content: string;
  public content_back: string;
  public imageUri: string;
  public messageName: string;
}
/* 历史消息返回结构 */
export class getHistoryMsgRpn {
  public senderUserId: string;
  public targetId: string;
  public sentTime: string;
  public messageId: number;
  public content: contentRst;
  public messageType: string;
  public messageUId: string;
  public sentStatus: any;
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
export function getUserList(userId: string) : q.Promise<getRpn> {
  const key: string = config.redis.keyPrefix.userList + userId
  let deferred: q.Deferred<getRpn> = q.defer<getRpn>();
  
  client.get(key,(err, reply)=>{
    try{
      return deferred.resolve(JSON.parse(reply) as getRpn);
    }catch(e){
      return []
    }
  });
  return deferred.promise;
}

/**
 * 设置会话列表
 * key: "gxt_emall_IM_userlist_" + userid 盖讯通融云处的ID
 * 过期时间暂定一个月
 */
export async function setUserList(userId: string, rst: setRst) {
  const key: string = config.redis.keyPrefix.userList + userId

  let data: any = await getUserList(userId)
  // console.log('原始redis记录值 ',data)

  if (data == null || data == 'null'){
    data  = []
  }
  //直接替换旧的参数值
  const value: Object = {
    targetId: rst.targetId, /* 目标ID */
    gwCode: rst.gwCode, /* 用户GW号 */
    userLogo: rst.userLogo, /* 头像 */
    userName: rst.userName, /* 商铺名称 */
    lastMessage: rst.lastMessage, /* 最后一条消息内容 */
    lastMsgType: rst.lastMsgType, /* 消息类型 */
    messagesNumber: rst.messagesNumber, /* 消息数 */
    sentTime: new Date().getTime()
  }
  //验证是否存在
  let isExist: boolean = false
  for (let k in data) {
    if (data[k].targetId == rst.targetId) {
      isExist = true
      data[k] = value
    }
  }
  if(!isExist) {
    data.push(value)
  } 
  // console.log('将设置的值',data)
  client.set(key, JSON.stringify(data), function(err, reply) {
    // console.log(reply)
  })
  // 设置过期时间/ 秒
  client.expire(key, 3600*24*30)
}

/**
 * 设置历史消息列表 队列
 */
export async function setHistoryMsg(userId: string, targetId: string, message: setHistoryMsgRst){
  const key: string = config.redis.keyPrefix.historyMsg + tool.md5(userId + '_' + targetId)
  console.log(JSON.stringify(message))
  client.RPUSH(key, JSON.stringify(message), function(err, reply) {
    // console.log(reply) // OK
  })
  client.expire(key, 3600*24*30)
}

/**
 * 取得用户对应的历史消息,默认最新15条
 */
export async function getHistoryMsg(userId:string, targetId: string, start: number, end: number){
  const key: string = config.redis.keyPrefix.historyMsg + tool.md5(userId + '_' + targetId)

  return new Promise((resolve, reject) => {
    client.LRANGE(key, start, end, (err, reply) => {
      try{
        // console.log(reply)
        resolve(reply);
      }catch(e){
        return []
      }
    });
  })
}

/**
 * 设置融云TOKEN 服务端记录保存 60分钟
 */
export async function setRongCloudToken(userId: string, targetId: string, data: any){
  const key: string = config.redis.keyPrefix.rongCloudToken + userId + '_' + targetId
  
  await client.SET(key, JSON.stringify(data), (err, reply) => {
    // console.log(reply)
  });
  
  // 设置过期时间/ 秒
  client.expire(key, 60*60)
}

/**
 * 取得融云TOKEN 服务端记录数据
 */
export async function getRongCloudToken(userId: string, targetId: string){
  const key: string = config.redis.keyPrefix.rongCloudToken + userId + '_' + targetId
  
  return new Promise((resolve, reject) => {
    client.GET(key, (err, reply) => {
      try{
        //console.log(reply) // null
        resolve(reply);
      }catch(e){
        return null
      }
    });
  })
}