import regeneratorRuntime from './regenerator-runtime/runtime'

const ERR_DURATION = 3000
const wxUpload = async (url, params = {}) => {
  let data = params.data || {}
  let method = params.method || 'POST'

  if (params.hideLoading === false) {
    wx.showLoading({
      title: 'Loading',
    })
  }
  let ReqData = {
    url: url,
    formData: data,
    name: params.fieldName || 'file',
    filePath: params.filePath
  }
  if(params.header) {
    ReqData.header = params.header
  }

  let res = await new Promise((resolve, reject) => {
    wx.uploadFile({
      ...ReqData,
      success: (res) => {
        console.log('==== success ====')
        console.log(url)
        console.log(res)
        if (res && res.statusCode == 200) {
          console.log('res.statusCode:', res)
          if (res.data) {
            resolve(res.data)
          } else {
            // reject(res)
            wx.showToast({
              title: 'System Error',
              image: '/assets/icons/api_error.png',
              duration: ERR_DURATION
            })
          }
        } else {
          wx.showToast({
            title: `${res.statusCode} ${res.errMsg}` || 'System Error',
            image: '/assets/icons/api_error.png',
            duration: ERR_DURATION
          })
          reject(res)
        }
      },
      fail: (err) => {
        console.log('==== err ====')
        console.log(url)
        console.log(err)
        wx.showToast({
          title: err.errMsg,
          image: '/assets/icons/api_error.png',
          duration: ERR_DURATION
        })
        reject(err)
      },
      complete: (e) => {
        wx.hideLoading()
      }
    })
  })
  return res
}

export {
  wxUpload
}