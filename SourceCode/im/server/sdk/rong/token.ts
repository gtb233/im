import * as client from './client'
import urlConfig from './urlConfig'
/**
 * 请求参数
 */
export class TokenRst {
    public userId: string;
    public name: string;
    public portraitUri: string;
}
/**
 * 返回数据
 */
export class TokenRpn {
    public code: string;
    public token: number
    public userId: string;
}
/**
 * 获取数据
 * @param rst 参数
 */
export async function exec(rst: TokenRst) {
    const data = await client.exec(urlConfig.token, rst);
    return JSON.parse(data) as TokenRpn;
}
