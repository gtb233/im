import * as client from './client'
import urlConfig from './urlConfig'
/**
 * 请求参数
 */
export class userInfoRst {
    public userId: string; //用户ID-盖讯通处理的ID
}
/**
 * 返回数据
 */
export class userInfoRpn {
    public result: number;
    public tag: string;
    public entity: any;
}


/**
 * 获取用户信息数据
 * @param rst 参数
 */
export async function exec(rst: userInfoRst) {
    const data: string = await client.exec(urlConfig.userInfo, rst);
    try{
        let result: any = JSON.parse(data) as client.RSM<userInfoRpn>;
        if(result.result == "1"){
            let entity = {
                userId: result.entity.userId,
                userName: result.entity.userName,
                userNickname: result.entity.userNickname,
                gaiNumber: result.entity.gaiNumber,
                userHead: result.entity.userHead
            }
            result.entity  = entity
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
