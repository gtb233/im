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

/**
 * 获取历史会话列表
 */
export function getUserList() {
  console.log(123)
}

/**
 * 设置会话列表
 */
export function setUserList(){
  
}
