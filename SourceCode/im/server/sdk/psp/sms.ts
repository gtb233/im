import * as client from './client'
import urlConfig from './urlConfig'
/**
 * 请求参数
 */
export class SmsRst {
    /**
     * 短信内容(必填)
     */
    public content: string;
    /**
     * 接收短信电话号码(必填)
     */
    public mobile: string;
    /**
     * 短信渠道（必填，channelID）
     */
    public channel: string;
    /**
     * 短信类型（必填，0：验证码 1：其他...）
     */
    public type: number;
}
/**
 * 返回数据
 */
export class SmsRpn {
    public status: number;
    /// 响应描述
    public msg: string;
    /// 响应数据
    public data: object;
}
/**
 * 获取数据
 * @param rst 参数
 */
export async function exec(rst: SmsRst) {
    const data = await client.exec(urlConfig.sms, rst);
    return JSON.parse(data) as SmsRpn;
}

