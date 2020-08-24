import regeneratorRuntime from './regenerator-runtime/runtime'

const ERR_DURATION = 3000
const wxRequest = async (url, params = {}) => {
  let header = params.header || {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  let data = params.data || {}
  let method = params.method || 'POST'

  let res = await new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: header,
      success: (res) => {
        if (res && res.statusCode == 200) {
          console.log('====== success response =====')
          console.log(res)
          if (url.includes('/api/parameter/changeData')) {
            resolve(res)
            return
          }

          if (url.includes("/api/v1/commondata/")) {
            console.log('=========')
            console.log('111')
            res.code = 200
            resolve(res)
            return
          }

          if (res.data && (res.data.status !== undefined || res.data.code != undefined)) {
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
          console.log('====== err response ======')
          console.log(res)
          // wx.showToast({
          //   title: `${res.statusCode} ${res.errMsg}` || 'System Error',
          //   image: '/assets/icons/api_error.png',
          //   duration: ERR_DURATION
          // })
          reject(res)
        }
      },
      fail: (err) => {
        console.log('==== err ====')
        console.log(url)
        console.log(err)
        // wx.showToast({
        //   title: err.errMsg,
        //   image: '/assets/icons/api_error.png',
        //   duration: ERR_DURATION
        // })
        reject(err)
      },
      complete: (e) => {

      }
    })
  })
  return res
}

export {
  wxRequest
}