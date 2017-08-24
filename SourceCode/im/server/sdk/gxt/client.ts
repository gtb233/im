import config from '../../config'
import * as httpm from 'typed-rest-client/HttpClient'

const httpc: httpm.HttpClient = new httpm.HttpClient('');
/**
 * 通用响应类，无分页
 */
export class RSM<T>
{
    /// 响应代码
    public resultCode: string;
    /// 响应描述
    public resultDes: string;
    /// 响应数据
    public resultData: T;
}

/* 
 * http 请求
 * @param url 
 * @param rst 
 */

export async function exec<T>(url: string, rst: any) {
    const headers = {
        ["Content-Type"]: "application/x-www-form-urlencoded"
    }

    let query = Object.keys(rst).map(k => k + '=' + rst[k]).join('&');
    let re = await httpc.post(config.gxt.url + url, query, headers);
    return await re.readBody();
}
