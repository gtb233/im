配置说明：
服务端域名：server.chat.com
配置示例：
server {
    listen 80;
    server_name server.chat.com;
    location / {
        proxy_pass http://127.0.0.1:8081;
    }
}

客户端：chat.com
server {
    listen 80;

    server_name chat.com;
    
    root        "D:\phpStudy\WWW\gxt-web-im\SourceCode\server\client";
    index   index.html;
}

请求示例：http://chat.com/?token=GW78829820&storeID=GW00104713

与盖讯通对接拟定请求参数与返回结构
//请求数据示例
{
    userToken : '', // 用于验证用户身份，应与userID相关的算法
    userID: '', //用户GW号
    storeID: '' //商家GW号
}
//返回数据示例
{
    userID: rongCloudToken, //用户融云TOKEN
    storeID: rongCloudID    //盖讯通用户唯一标识
}
