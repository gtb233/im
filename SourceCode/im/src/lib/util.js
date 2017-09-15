import config from '../../config/config'

/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
export function urlParse () {
  let url = window.location.href
  let obj = {}
  let reg = /[?&][^?&]+=[^?&]+/g
  let arr = url.match(reg)
  // ['?id=12345', '&a=b']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=')
      let key = decodeURIComponent(tempArr[0])
      let val = decodeURIComponent(tempArr[1])
      obj[key] = val
    })
  }
  return obj
};

/**
 * 图片添加域名前缀
 */
export function imageUrlConvert (url, absoluteUrl = true) {
  if (url) {
    let reg = /^http:\/\//g
    let arr = url.match(reg)
    if (!arr) {
      url = config.userImgUrl + url
    }
  }
  return url
}
