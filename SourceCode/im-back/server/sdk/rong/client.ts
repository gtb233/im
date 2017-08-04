import config from '../../config'
import * as httpm from 'typed-rest-client/HttpClient'
import { sha1 } from '../../lib/util'

const httpc: httpm.HttpClient = new httpm.HttpClient('');

/* 
 * http 请求
 * @param url 
 * @param rst 
 */

export async function exec<T>(url: string, rst: any) {

    const APPKEY = config.rong.RONGCLOUD_APP_KEY;
    const APPSECRET = config.rong.RONGCLOUD_APP_SECRET;
    const NONCE = parseInt((Math.random() * 0xffffff).toString());
    const TIMESTAMP = Date.parse((new Date()).toString()) / 1000;
    const SIGNATURE = sha1(APPSECRET + NONCE + TIMESTAMP);
    const headers = {
        ["App-Key"]: APPKEY,
        ["Nonce"]: NONCE,
        ["Timestamp"]: TIMESTAMP,
        ["Signature"]: SIGNATURE,
        ["Content-Type"]: 'application/x-www-form-urlencoded',
    }
    let query = Object.keys(rst).map(k => k + '=' + rst[k]).join('&');
    let re = await httpc.post(config.rong.url + url, query, headers);
    return await re.readBody();
}