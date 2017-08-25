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
请求示例：http://localhost:8081/#/?user=GW87209993&storeid=GW50326071&token=sfdfdfsdfdsf

盖讯通测试地址：http://172.18.7.64:8080/backji/gmall/userInfoForMall
测试账号:
GW87209993   123456
GW50326071   123456
GW00172590

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