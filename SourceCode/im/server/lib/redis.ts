import * as redis from 'redis';
import config from '../config';
import * as q from 'q';

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
export function getUserList(userId: string) : q.Promise<getRpn> {
  const key: string = "gxt_emall_IM_userlist_" + userId
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
  const key: string = "gxt_emall_IM_userlist_" + userId

  let data: any = await getUserList(userId)
  // console.log('原始redis记录值 ',data)

  if (data == null || data == 'null'){
    data  = []
  }

  //直接替换旧的参数值
  const value: Object = {
    targetId: rst.targetId, /* 目标ID */
    userLogo: rst.userLogo, /* 头像 */
    userName: rst.userName, /* 商铺名称 */
    lastMessage: rst.lastMessage, /* 最后一条消息内容 */
    messagesNumber: 0, /* 消息数 */
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
    console.log(reply)
  })
  // 设置过期时间/ 秒
  client.expire(key, 3600*24*30)
}