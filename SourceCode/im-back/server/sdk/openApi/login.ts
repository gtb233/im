import * as client from './client'
import urlConfig from './urlConfig'
/**
 * 请求参数
 */
export class loginRst {
    public loginInfo: string;
}
/**
 * 返回数据
 */
export class loginRpn {
    public uid: string;
    public id: number
    public code: string;
    public userName: string;
    public email: string;
    public mobile: string;
    public accountUid: string;
    public userType: string;
    public userTypes: number[];
    public tempID: string;
    public token: string;
}
/**
 * 获取数据
 * @param rst 参数
 */
export async function exec(rst: loginRst) {
    const data = await client.exec(urlConfig.login, rst);
    return JSON.parse(data) as client.RSM<loginRpn>;
}

