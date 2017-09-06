import config from '../../config'
import * as httpm from 'typed-rest-client/HttpClient'

import * as httpI from 'typed-rest-client/Interfaces'

/**
 * 设置代理，用于fiddle抓包 调试用
 */
let httpc: httpm.HttpClient = new httpm.HttpClient('')
if (config.proxy) {
    let proxyConfig: httpI.IProxyConfiguration = {
        proxyUrl: 'http://127.0.0.1:8888'
    }
    let requestOption: httpI.IRequestOptions = {
        proxy: proxyConfig
    }
    httpc = new httpm.HttpClient('', undefined, requestOption);
}

/**
 * 通用响应类，无分页 （旧接口返回格式）
 */
export class RSM<T>
{
    /// 响应代码
    public result: string;
    /// 响应描述
    public tag: string;
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
        ["Content-Type"]: "application/json; charset=utf-8",
    }
    let query:string = JSON.stringify({
        code: rst.code
    })

    // let query = Object.keys(rst).map(k => k + '=' + rst[k]).join('&');
    let re = await httpc.post(config.core.url + url, query, headers);
    return await re.readBody();
}
 