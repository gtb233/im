import * as client from './client'
import urlConfig from './urlConfig'
/**
 * 请求参数
 */
export class userInfoRst {
    public code: string; //GW号
}
/**
 * 返回数据
 */
export class userInfoRpn {
    public code: string;
    public description: string;
    public data: any;
}


/**
 * 获取用户信息数据
 * @param rst 请求参数
 */
export async function exec(rst: userInfoRst) {
    const data: string = await client.exec(urlConfig.userInfo, rst);
    try{
        let result: any = JSON.parse(data) as client.RSM<userInfoRpn>;
        if(result.code == ""){
            let data = {
                // userId: result.data.uid, // 此为商城USERID
                code: result.data.code, // GW号
                grade: result.data.grade, // 会员等级
                userName: result.data.userName,
                // nickname: result.data.nickname, //不再使用
                userHead: result.data.headPortraitURL
            }
            result.data  = data
            return result
        }else{
            return {
                code:0,
                description: result.description,
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
