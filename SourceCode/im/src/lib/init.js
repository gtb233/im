/* 上传初始化操作 */
import UploadFile from './upload'

export const calcPosition = (width, height, opts) => {
  let isheight = width < height
  let scale = isheight ? height / width : width / height
  let zoom
  let x = 0
  let y = 0
  let w
  let h

  let gtScale = function () {
    if (isheight) {
      zoom = width / 100
      w = 100
      h = height / zoom
      y = (h - opts.maxHeight) / 2
    } else {
      zoom = height / 100
      h = 100
      w = width / zoom
      x = (w - opts.maxWidth) / 2
    }
    return {
      w: w,
      h: h,
      x: -x,
      y: -y
    }
  }

  let ltScale = function () {
    if (isheight) {
      zoom = height / opts.maxHeight
      h = opts.maxHeight
      w = width / zoom
    } else {
      zoom = width / opts.maxWidth
      w = opts.maxWidth
      h = height / zoom
    }
    return {
      w: w,
      h: h,
      x: -x,
      y: -y
    }
  }
  return scale > opts.scale ? gtScale() : ltScale()
}

export const getBlobUrl = (file) => {
  let URL = window.URL || window.webkitURL
  return URL ? URL.createObjectURL(file) : ''
}

export const getThumbnail = (file, opts, callback) => {
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')
  let img = new Image()
  img.onload = function () {
    let pos = calcPosition(img.width, img.height, opts)
    canvas.width = pos.w > opts.maxWidth ? opts.maxWidth : pos.w
    canvas.height = pos.h > opts.maxHeight ? opts.maxHeight : pos.h
    context.drawImage(img, pos.x, pos.y, pos.w, pos.h)
    try {
      let base64 = canvas.toDataURL(file.type, opts.quality)
      let reg = new RegExp('^data:image/[^;]+;base64,')
      base64 = base64.replace(reg, '')
      callback(base64)
    } catch (e) {
      throw new Error(e)
    }
  }
  img.src = typeof file === 'string' ? 'data:image/jpg;base64,' + file : getBlobUrl(file)
}

const _compress = function (data, callback) {
  let file = data.file
  let opts = data.compress
  getThumbnail(file, opts, callback)
}

const _init = function (config, callback) {
  if (config.getToken) {
    config.getToken(function (token) {
      config.multi_parmas || (config.multi_parmas = {})
      config.multi_parmas.token = token
      config.headers || (config.headers = {})
      if (config.base64) {
        config.headers['Content-type'] = 'application/octet-stream'
        config.headers['Authorization'] = 'UpToken ' + token
      }
      let instance = UploadFile.init(config) // 图片上传操作实例
      callback(instance)
    })
  } else {
    config.headers || (config.headers = {})
    if (config.base64) {
      config.headers['Content-type'] = 'application/octet-stream'
    }
    let instance = UploadFile.init(config)
    callback(instance)
  }
}

// callback 为API处带过来的
const _upload = function (data, instance, callback) {
  instance.upload(data.file, {
    onError: function (errorCode) {
      callback.onError(errorCode)
    },
    onProgress: function (loaded, total) {
      callback.onProgress(loaded, total)
    },
    onCompleted: function (result) {
      result.filename || (result.filename = result.hash)
      let compress = data.compressThumbnail || _compress
      if (data.compress) {
        compress(data, function (thumbnail) {
          result.thumbnail = thumbnail
          callback.onCompleted(result)
        })
      } else {
        callback.onCompleted(result)
      }
    }
  })
}

export const File = function (instance) {
  let me = this
  this.instance = instance
  this.upload = function (file, callback) {
    let data = {
      file: file
    }
    _upload(data, me.instance, callback)
  }
  this.cancel = function () {
    me.instance.cancel()
  }
}

export const initFile = function (config, callback) {
  _init(config, function (instance) {
    let uploadFile = new File(instance)
    callback(uploadFile)
  })
}

export const Img = function (instance, cfg) {
  let me = this
  this.cfg = cfg
  this.instance = instance
  this.upload = function (file, callback) {
    let data = {
      file: file,
      compress: me.cfg
    }
    _upload(data, me.instance, callback)
  }

  this.cancel = function () {
    me.instance.cancel()
  }
}

export const initImage = function (config, callback) {
  _init(config, function (instance) {
    let compress = {
      maxHeight: config.height || 240,
      maxWidth: config.width || 240,
      quality: config.quality || 0.5,
      scale: config.scale || 2.4
    }
    let uploadImage = new Img(instance, compress)
    callback(uploadImage)
  })
}

export const ImgBase64 = function (config) {
  config.base64 = true
  Img.call(this, config)
}

export const initImgBase64 = function (config, callback) {
  config.base64 = true
  initImage.call(this, config, callback)
}

export default {
  initFile: initFile,
  initImage: initImage,
  initImgBase64: initImgBase64,
  dataType: UploadFile.dataType
}
