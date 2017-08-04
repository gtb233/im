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