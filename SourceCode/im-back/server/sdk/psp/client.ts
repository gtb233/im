import config from '../../config'
import * as httpm from 'typed-rest-client/HttpClient'

const httpc: httpm.HttpClient = new httpm.HttpClient('');
/**
 * 通用响应类，无分页
 */
export class RSM<T>
{
    /// 响应代码
    public status: number;
    /// 响应描述
    public msg: string;
    /// 响应数据
    public data: T;
}

/* 
 * http 请求
 * @param url 
 * @param rst 
 */

export async function exec<T>(url: string, rst: any) {
    const headers = {
        ["Content-Type"]: "application/json",
    }
    //统一设置channelId
    if(!rst.channel){
        rst.channel = config.openApi.channelId;
    }
    let re = await httpc.post(config.psp.url + url, JSON.stringify(rst), headers);
    return await re.readBody();
}