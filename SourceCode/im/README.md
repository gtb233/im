# im

> gxt web im

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# 前端部分
请求示例：http://localhost:8081/#/?user=GW87209993&storeid=GW00172590&token=sfdfdfsdfdsf&isQuery=1
本地测试使用时：
配置本地 im.gemall.com 代理到 http://localhost:8081/

## 配置项
跨域设置 document.domain = ''
配置文件有两处修改 config 与server下

## 测试环境：
> 测试账号:
- GW00000001   123456

- GW00000006   123456

## 接口

- 获取用户TOKEN： 

```
请求参数与返回结构
//请求数据示例
{
    fromgw = '',
    togw = ''
}
//返回数据示例
{
    "resultData": {
        "fromgw": {
            "userId": "1c1b1e4c23b04c25a4126f169b954863",
            "userNickname": "GW87209993",
            "userHead": ""
        },
        "rongToken": "ymT7KOk6TJxovvJ1ARt+vN6DSeCtQabBhS/jeZmabM0MIF+VT0TMplxz2Wxw0DINvPorqygPd70bTIGrcnjwGb2dUvd8XyG83/4PyCBbCxWxXAmSyKq0UzRAE0sp2NqH0uw30ukEB3A=",
        "togw": {
            "userId": "c3b9091311c2496ba3cb4e3d01fb9405",
            "userNickname": "lucky",
            "userHead": "/files/head/img/c3b9091311c2496ba3cb4e3d01fb94051454056284726"
        }
    },
    "resultCode": "200",
    "resultDes": "查询成功"
}
// 错误示例
{
    "resultData": null,
    "resultCode": "403",
    "resultDes": "GW号不存在"
}
```
- 根据userid 查询用户信息 (客户端使用版本，需要TOKEN)
/backji/user/viewInfo

- 根据userid 查询用户信息 (客户端使用版本)
/backji/user/getUserByUserId
```
{
    "result": "1",
    "myPage": null,
    "other": null,
    "page": null,
    "tag": "获取数据成功",
    "entity": {
        "userId": "5179f1c8d86e4fa58b8e4c0451467a9b",
        "userName": "GW00172590",
        "userNickname": "强哥",
        "userHead": "/files/head/img/5179f1c8d86e4fa58b8e4c0451467a9b20170915175535.png"
    },
    "map": null,
    "list": null
}
```