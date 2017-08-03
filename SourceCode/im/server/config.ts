export default {
    //一键哥接口
    openApi: {
        url: "http://172.18.7.192:905/",
        channelId: "C70FC61F-5DAB-439F-B713-E4E30E44C898"
    },
    //共服务平台api接口
    psp: {
        url: "http://pspapi.gfoto99.cn/"
    },
    //融云api
    rong: {
        url:'http://api.cn.ronghub.com/',
        // 认证 Cookie 名称，请根据业务自行定义，如：rong_im_auth
        AUTH_COOKIE_NAME: 'rong_im_auth_test',
        // 认证 Cookie 加密密钥，请自行定义，任意字母数字组合
        AUTH_COOKIE_KEY: 'key123456GOODluck',
        // 认证 Cookie 过期时间，单位为毫秒，2592000000 毫秒 = 30 天
        AUTH_COOKIE_MAX_AGE: 3600000,//一小时
        // 融云颁发的 App Key，请访问融云开发者后台：https://developer.rongcloud.cn
        RONGCLOUD_APP_KEY: 'mgb7ka1nmf10g',
        // 融云颁发的 App Secret，请访问融云开发者后台：https://developer.rongcloud.cn
        RONGCLOUD_APP_SECRET: 'PvU58bpBSBm',
        // 融云短信服务提供的注册用户短信模板 Id
        RONGCLOUD_SMS_REGISTER_TEMPLATE_ID: '',
        // 七牛颁发的 Access Key，请访问七牛开发者后台：https://portal.qiniu.com
        QINIU_ACCESS_KEY: '',
        // 七牛颁发的 Secret Key，请访问七牛开发者后台：https://portal.qiniu.com
        QINIU_SECRET_KEY: '',
        // 七牛创建的空间名称，请访问七牛开发者后台：https://portal.qiniu.com
        QINIU_BUCKET_NAME: '',
        // 七牛创建的空间域名，请访问七牛开发者后台：https://portal.qiniu.com
        QINIU_BUCKET_DOMAIN: '',
        // N3D 密钥，用来加密所有的 Id 数字，不小于 5 位的字母数字组合
        N3D_KEY: '11EdDIaqms22123',
        // 认证 Cookie 主域名 如果没有正式域名，请修改本地 hosts 文件配置域名

    }
}