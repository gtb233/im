import config from '../../config'
import * as httpm from 'typed-rest-client/HttpClient'

const httpc: httpm.HttpClient = new httpm.HttpClient('');
/**
 * 通用响应类，无分页
 */
export class RSM<T>
{
    /// 响应代码
    public code: string;
    /// 响应描述
    public description: string;
    /// 响应数据
    public resData: T;
}
/// 通用响应类
export class RSMP<T>
{
    /// 响应代码
    public code: string;
    /// 响应描述
    public description: string
    /// 响应数据
    public resData: DataPageInfo<T>
}

export class DataPageInfo<T>
{
    /// 分页信息
    public pageInfo: pageInfo;
    /// 响应数据集合
    public list: T[]
}

export class pageInfo {
    /// 总条数
    public totalCount: number;
    /// 当前页条数
    public pageCount: number;
}

/* 
 * http 请求
 * @param url 
 * @param rst 
 */

export async function exec<T>(url: string, rst: object) {
    const headers = {
        ["Content-Type"]: "application/json",
        ["clientType"]: 7
    }
    let re = await httpc.post(config.openApi.url + url, JSON.stringify(rst), headers);
    return await re.readBody();
}