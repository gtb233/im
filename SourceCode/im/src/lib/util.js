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
  } else {
    url = ''
  }
  return url
}

/**
 * 对象引用 修改成拷贝（值引用）
 * @param {*} obj
 */
export function deepCopy (obj) {
  if (typeof obj !== 'object') {
    return obj
  }
  let newobj = {}
  for (let attr in obj) {
    newobj[attr] = deepCopy(obj[attr])
  }
  return newobj
}

/**
 * 统一时间输出格式：YYYY/MM/DD 返回格式可自行定义
 * @param {*} str
 * @returns str 2017/10/11
 */
export function changeTime (str) {
  // Thursday, July 10, 2017这样的格式，先转2017年1月12日
  if (str.indexOf(',') > 0) {
    let n = str.substring(str.lastIndexOf(',') + 2, str.length)
    let y = str.substring(str.indexOf(',') + 2, str.lastIndexOf(',') - 3)
    if (y === 'January') {
      y = '1'
    } else if (y === 'February') {
      y = '2'
    } else if (y === 'March') {
      y = '3'
    } else if (y === 'April') {
      y = '4'
    } else if (y === 'May') {
      y = '5'
    } else if (y === 'June') {
      y = '6'
    } else if (y === 'July') {
      y = '7'
    } else if (y === 'August') {
      y = '8'
    } else if (y === 'September') {
      y = '9'
    } else if (y === 'October') {
      y = '10'
    } else if (y === 'November') {
      y = '11'
    } else if (y === 'December') {
      y = '12'
    }
    let r = str.substring(str.lastIndexOf(',') - 2, str.lastIndexOf(','))
    if (r.indexOf('0') === 0) {
      r = r.substring(1, 2)
    }
    str = n + '年' + y + '月' + r + '日'
  }
  // yyyy/MM/dd格式，转换 2017/5/5 ===> 2017-5-5
  let curYear, curMonth, curDay
  let reg = new RegExp('/', 'i')
  if (str.match(reg)) {
    curYear = str.substring(0, 4)
    curMonth = str.substring(5, str.lastIndexOf('/'))
    curDay = str.substring(str.lastIndexOf('/') + 1)
  } else {
    curYear = str.substring(0, str.indexOf('年'))
    curMonth = str.substring(str.indexOf('年') + 1, str.indexOf('月'))
    curDay = str.substring(str.indexOf('月') + 1, str.indexOf('日'))
  }
  if (curMonth < 10) {
    curMonth = '0' + curMonth
  }
  if (curDay < 10) {
    curDay = '0' + curDay
  }
  let returnDate = curYear + '/' + curMonth + '/' + curDay
  return returnDate
}
