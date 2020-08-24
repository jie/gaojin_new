import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'
import {
  apiSearchForm
} from '../../after_lib/api'
import drawQrcode from '../../libs/weapp.qrcode.esm.js'
import PageBehavior from '../../utils/page_behaviors'
import mergePages from '../../libs/objectUtils'

const PageObject = mergePages({}, PageBehavior, {
  data: {
    pageName: 'ticket',
    language: {},
    locale: null,
    title: null,
    actvtId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  _onLoad: function (options) {
    this.getLanguage()
    this.setData({
      title: options.title,
      actvtId: options.actvtId
    })
    this.getSignupForm(options.formid)
  },


  getSignupForm: async function (formid) {
    let result = await apiSearchForm(formid)
    if (!result.status) {
      this.showToast(result.info)
      return
    } else {
      console.log(result.data)
      this.setData({
        formObj: result.data
      })
      this.draw()
    }
  },

  onShow: function () {
    let locale = wx.getStorageSync('locale')
    if (locale !== this.data.locale) {
      this.getLanguage()
    }
  },

  draw() {
    drawQrcode({
      width: 160,
      height: 160,
      x: 20,
      y: 20,
      canvasId: 'myQrcode',
      // ctx: wx.createCanvasContext('myQrcode'),
      typeNumber: 10,
      text: this.data.formObj.formManualSignUrl || 'empty',
      image: {
        // imageResource: '../../images/icon.png',
        dx: 70,
        dy: 70,
        dWidth: 60,
        dHeight: 60
      },
      callback(e) {
        console.log('e: ', e)
      }
    })
  },

  download() {
    // 导出图片
    let that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 300,
      height: 300,
      destWidth: 300,
      destHeight: 300,
      canvasId: 'myQrcode',
      success(res) {
        console.log('图片的临时路径为：', res.tempFilePath)
        let tempFilePath = res.tempFilePath
        // 保存图片，获取地址
        // wx.saveFile({
        //   tempFilePath,
        //   success (res) {
        //     const savedFilePath = res.savedFilePath
        //     console.log('savedFilePath', savedFilePath)
        //   }
        // })

        // 保存到相册
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success: function (res) {
            console.log(res)
            wx.showToast({
              title: that.data.language.base.saved_successfully,
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            console.log(err)
            wx.showToast({
              title: that.data.language.base.saved_fail,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  }
})

Page(PageObject)