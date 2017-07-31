import * as crypto from 'crypto'

export function md5(str: string): string {
    let md5 = crypto.createHash('md5')
    md5.update(str)
    return md5.digest('hex')
}

export function sha1(str: string): string {
    let sha1 = crypto.createHash('sha1')
    sha1.update(str)
    return sha1.digest('hex')
}

/**
 * 获取当前时间，不包含秒
 * @param m -当前分钟
 */
function getCurrentDate(m: number = 0) {
    let d = new Date();
    d.setMinutes(d.getMinutes() - m);
    let month = (d.getMonth() + 1);
    let dateArray = [
        d.getFullYear(),
        month < 10 ? '0' + month : month,
        d.getDate() < 10 ? '0'+d.getDate() : d.getDate(),
        d.getHours() < 10 ? '0'+d.getHours() : d.getHours(),
        d.getMinutes() < 10 ? '0'+d.getMinutes() : d.getMinutes(),
    ];
    return dateArray.join('');
}
/**
 * 检查token是否正确,30分钟内有效
 * @param from
 * @param to 
 * @param token 
 */
export function checkToken(from: string, to: string, token: string) {
    for (let i = 0; i < 30; i++) {
        if (sha1(from + to + 'gemall' + getCurrentDate(i)) == token) {
             return true;
        }
    }
    return false;
}