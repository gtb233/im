import * as client from './client'
import urlConfig from './urlConfig'
/**
 * 请求参数
 */
export class TokenRst {
    public fromgw: string; //用户ID
    public togw: string; //商家ID
}
/**
 * 返回数据
 */
export class TokenRpn {
    public rongToken: string;
    public fromgw: Object;
    public togw: Object;
}


/**
 * 获取数据
 * @param rst 参数
 */
export async function exec(rst: TokenRst) {
    const data = await client.exec(urlConfig.token, rst);
    try{
        return JSON.parse(data) as client.RSM<TokenRpn>;
    }catch(e){
        return data;
    }
   
}
