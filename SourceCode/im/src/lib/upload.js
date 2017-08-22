/* 上传处理模块 */
import uploadProcess from './qiniu'

let dataType = {
  form: getFormData,
  json: getJsonData,
  data: getData
}

export function genUId () {
  let date = new Date().getTime()
  let uuid = 'xxxxxx4xxxyxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (date + Math.random() * 16) % 16 | 0
    date = Math.floor(date / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
};

export function mergeOption (opts) {
  let options = {
    domain: '',
    method: 'POST',
    file_data_name: 'file',
    unique_key: 'key',
    base64_size: 4 * 1024 * 1024,
    chunk_size: 4 * 1024 * 1024,
    headers: {},
    multi_parmas: {},
    query: {},
    support_options: true,
    data: dataType.form,
    genUId: genUId
  }
  if (!opts || !opts.domain) {
    throw new Error('domain is null')
  }
  for (let key in opts) {
    options[key] = opts[key]
  }
  return options
}

export function mEach (m, callback) {
  for (let key in m) {
    callback(key, m[key])
  }
}

export function getFormData (file, opts) {
  let form = new FormData()
  if (opts.unique_key) {
    let suffix = file.name.substr(file.name.lastIndexOf('.'))
    let uniqueValue = genUId() + suffix
    form.append(opts.unique_key, uniqueValue)
    opts.unique_value = uniqueValue
  }
  form.append(opts.file_data_name, file)
  mEach(opts.multi_parmas, function (key, value) {
    form.append(key, value)
  })
  return form
}

export function getJsonData (file, opts) {
  let data = {}
  if (opts.unique_key) {
    let suffix = file.name.substr(file.name.lastIndexOf('.'))
    let uniqueValue = genUId() + suffix
    data[opts.unique_key] = uniqueValue
    opts.unique_value = uniqueValue
  }
  data[opts.file_data_name] = file
  mEach(opts.multi_parmas, function (key, value) {
    data[key] = value
  })
  return JSON.stringify(data)
}

export function getData (file, opts) {
  return file
}

export function Upload (options) {
  this.options = mergeOption(options)

  this.setOptions = function (opts) {
    let me = this
    mEach(opts, function (key, value) {
      me.options[key] = value
    })
  }

  this.upload = function (file, callback) { /* 调用七牛上传 */
    if (!file) {
      callback.onError('upload file is null.')
      return
    }
    let me = this
    uploadProcess(file, this.options, {
      onProgress: function (loaded, total) {
        callback.onProgress(loaded, total)
      },
      onCompleted: function (data) {
        callback.onCompleted(data)
      },
      onError: function (errorCode) {
        callback.onError(errorCode)
      },
      onOpen: function (xhr) {
        me.xhr = xhr
      }
    })
  }

  this.cancel = function () {
    this.xhr && this.xhr.abort()
  }
}

export function init (options) {
  return new Upload(options)
}

export function getResizeRatio (imageInfo, config) {
  // hasOwnProperty?

  let ratio = 1

  let oWidth = imageInfo.width
  let maxWidth = config.maxWidth || 0
  if (maxWidth > 0 && oWidth > maxWidth) {
    ratio = maxWidth / oWidth
  }

  let oHeight = imageInfo.height
  let maxHeight = config.maxHeight || 0
  if (maxHeight > 0 && oHeight > maxHeight) {
    let ratioHeight = maxHeight / oHeight
    ratio = Math.min(ratio, ratioHeight)
  }

  let maxSize = config.maxSize || 0
  let oSize = Math.ceil(imageInfo.size / 1000) // K，Math.ceil(0.3) = 1;
  if (oSize > maxSize) {
    let ratioSize = maxSize / oSize
    ratio = Math.min(ratio, ratioSize)
  }

  return ratio
}

export function resize (file, config, callback) {
  // file对象没有高宽
  let type = file.type // image format
  let canvas = document.createElement('canvas')

  let reader = new FileReader()

  reader.readAsDataURL(file)
  reader.onload = function (evt) {
    let imageData = evt.target.result
    let img = new Image()
    img.src = imageData
    let width = img.width
    let height = img.height
    let imageInfo = {
      width: width,
      height: height,
      size: evt.total
    }
    let ratio = getResizeRatio(imageInfo, config)
    let newImageData = imageData
    if (ratio < 1) {
      newImageData = compress(img, width * ratio, height * ratio)
    }
    callback(newImageData)
  }

  function compress (img, width, height) {
    canvas.width = width
    canvas.height = height

    let context = canvas.getContext('2d')
    context.drawImage(img, 0, 0, width, height)

    /*
      If the height or width of the canvas is 0, the string "data:," is returned.
      If the requested type is not image/png, but the returned value starts with data:image/png, then the requested type is not supported.
      Chrome also supports the image/webp type.
    */
    let supportTypes = {
      'image/jpg': true,
      'image/png': true,
      'image/webp': supportWebP()
    }
    // let exportType = "image/png";
    // if(supportTypes[type]){
    //  exportType = type;
    // }
    // 多端一致，缩略图必须是 jpg
    let exportType = 'image/jpg'
    let newImageData = canvas.toDataURL(exportType)
    return newImageData
  }

  function supportWebP () {
    try {
      return (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0)
    } catch (err) {
      return false
    }
  }
}

export default {
  init: init,
  dataType: dataType,
  resize: resize
}
