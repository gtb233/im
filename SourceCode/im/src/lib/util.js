/* 取得URL参数数据 name:查询的参数名称 */
export function getQueryString (name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])

  return null
}

export default getQueryString
