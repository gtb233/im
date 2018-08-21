import * as client from './client'
import urlConfig from './urlConfig'
/**
 * 旧时盖讯通ID不为GWID，故需此接口
 */

/**
 * 请求参数
 */
export class userInfoRst {
    public code: string | undefined; //用户ID-盖讯通处理的ID
}
/**
 * 返回数据
 */
export class userInfoRpn {
    public id : number | undefined;
    public username : string | undefined;
    public nickname : string | undefined;
    public sex: number | undefined;
    public head_portrait: string | undefined;
}


/**
 * 获取用户信息数据
 * @param rst 参数
 */
export async function exec(rst: userInfoRst) {
    const data: string = await client.exec(urlConfig.userInfo, JSON.stringify(rst) );
    try{
        let result: any = JSON.parse(data) as client.RSM<userInfoRpn>;
        if(result.resultCode == "0001"){
            let entity = {
                userId: result.resultData.id, // 此为商城USERID
                userName: result.resultData.username, // 注意大小写
                nickname: result.resultData.nickname,
                userHead: result.resultData.headPortrait
            }
        
            result.result = 1
            result.entity  = entity
            result.tag = '成功'
            return result
        }else{
            return {
                result:0,
                tag:'用户信息获取失败',
                entity: {}
            };
        }
    }catch(e){
        return {
            result:0,
            tag:'获取信息错误，数据异常！',
            entity: {}
        };
    }
   
}
