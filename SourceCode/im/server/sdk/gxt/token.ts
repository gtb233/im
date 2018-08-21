import * as client from './client'
import urlConfig from './urlConfig'
/**
 * 请求参数
 */
export class TokenRst {
    public fromgw: togwRst | undefined; //用户ID
    public togw: togwRst | undefined; //商家ID
    // public fromUserHead: string; // 头像
    // public fromUserNickname: string; // 昵称
    // public togw: string; //商家ID
    // public toUserHead: string; // 头像
    // public toUserNickname: string;
}

class togwRst {
    public GW: string | undefined;
    public userNickname: string | undefined;
    public userHead: string | undefined;
}


/**
 * 返回数据
 */
export class TokenRpn {
    public rongToken: string | undefined;
    public fromgw: togwRpn | undefined;
    public togw: togwRpn | undefined;
}

class togwRpn {
    public userId: string | undefined;
    public userNickname: string | undefined;
    public userHead: string | undefined;
}


/**
 * 获取数据
 * @param rst 参数
 */
export async function exec(rst: TokenRst) {
    const data = await client.exec(urlConfig.token, JSON.stringify(rst));
    try{
        return JSON.parse(data) as client.RSM<TokenRpn>;
    }catch(e){
        return data;
    }
   
}
