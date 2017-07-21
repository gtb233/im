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
