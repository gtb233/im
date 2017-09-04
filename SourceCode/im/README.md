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

## 盖讯通测试环境：
> 测试账号:
- GW87209993   123456

- GW50326071   123456

- GW00172590

## 接口

- 获取用户TOKEN： http://172.18.7.64:8080/backji/gmall/userInfoForMall
```
与盖讯通对接拟定请求参数与返回结构
//请求数据示例
{
    fromgw = '', //用户GW号
    togw = '' //商家GW号
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
http://172.18.7.64:8080/backji/user/viewInfo

- 根据userid 查询用户信息 (客户端使用版本，需要TOKEN)
http://172.18.7.64:8080/backji/user/getUserByUserId
```
{
    "result": "1",
    "myPage": null,
    "other": null,
    "page": null,
    "tag": "获取数据成功",
    "entity": {
        "constellation": "",
        "registerDate": "2017-08-24 15:51:01",
        "unread": 0,
        "userPassword": "e10adc3949ba59abbe56e057f20f883e",
        "userQq": "",
        "addr": "",
        "userPassword2": "c19c632062977f0900c1a8691e9caa18da9175a6dee99d3f",
        "userBirthday": "",
        "apiKey": "!@*^juyou#i@*%$",
        "city": "",
        "id": 14566,
        "userState": 1,
        "is_login_check": true,
        "userBg": "",
        "userId": "5179f1c8d86e4fa58b8e4c0451467a9b",
        "province": "",
        "userName": "GW00172590",
        "longitude": 0,
        "userPhone": "",
        "userDescription": "",
        "userHead": "",
        "signName": "",
        "job": "",
        "userNickname": "GW00172590",
        "gaiNumber": "GW00172590",
        "systemBg": 1,
        "logout": true,
        "school": "",
        "email": "",
        "company": "",
        "userSex": 0,
        "latitude": 0,
        "userAge": 0,
        "specialSign": "",
        "salt": "",
        "mobile": "null"
    },
    "map": null,
    "list": null
}
```