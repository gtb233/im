import * as client from './client'
import urlConfig from './urlConfig'

/**
 * 请求参数
 */
export class userInfoRst {
    public code: string | undefined; //GW号
}
/**
 * 返回数据- T部分类型
 */
export class userInfoRpn {
    public id : number | undefined;
    public username : string | undefined;
    public nickname : string | undefined;
    public sex: number | undefined;
    public headPortrait: string | undefined;
}


/**
 * 获取用户信息数据
 * @param rst 请求参数
 */
export async function exec(rst: userInfoRst) {
    const data: string = await client.exec(urlConfig.userInfo, rst);
    try{
        let result = JSON.parse(data) as client.RSM<userInfoRpn>;
        if(result.resultCode == "0001"){
            let data = {
                userId: result.resultData.id, // 此为商城USERID
                code: result.resultData.username, // GW号
                grade: 0, // 会员等级
                userName: result.resultData.username, //注意大小写
                nickname: result.resultData.nickname,
                userHead: result.resultData.headPortrait
            }
            result.code  = result.resultCode
            result.description = result.resultDesc
            result.data  = data
            return result
        }else{
            return {
                code: 0,
                description: result.resultDesc,
                data: {}
            };
        }
    }catch(e){
        return {
            code:0,
            description:'获取信息错误，数据异常！',
            data: {}
        };
    }
   
}
