import { apiGetThirdAccessWxSpUserLoginInfo, apiThirdpartyWxLogin } from './after_lib/api'
import regeneratorRuntime from './libs/regenerator-runtime/runtime'
import language from './libs/language'
import settings from '/settings/index'
App({
  onLaunch: function (options) {

    this.globalData.systemInfo = wx.getSystemInfoSync()
    console.log(this.globalData.systemInfo)
    this.setLanguage()


    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else if (settings.cloud_env) {
      wx.cloud.init({
        env: settings.cloud_env,
        traceUser: true,
      })
    }
    console.log('[cloudENV]:', settings.cloud_env)
  },
  onShow: function (options) {
    console.log('onAppShow:', options)
    if (options.shareTicket) {
      wx.getShareInfo({
        shareTicket: options.shareTicket,
        success: (res) => {
          if (res.cloudID) {
            wx.cloud.callFunction({
              name: 'main',
              data: {
                apiName: 'getDataByCloudID',
                shareInfo: wx.cloud.CloudID(res.cloudID),
              },
              success: (shareRes) => {
                console.log('shareRes:', shareRes)
              }
            })
          }
        }
      })
    }
    if(options.path != 'pages/landing/landing') {
      this.startLogin()
      console.log('app start login')
    }

  },
  startLogin: function (next_url) {
    let that = this
    let result = null;
    wx.login({
      success: async function (res) {
        console.log(res)
        try {
          if (settings.enviroment == 'pro_kedge' || settings.enviroment == 'ceibs') {
            result = await apiThirdpartyWxLogin(res.code)
          } else {
            result = await apiGetThirdAccessWxSpUserLoginInfo(res.code)
          }

          
          if (!result.status) {
            wx.showToast({
              title: 'wxlogin_fail',
              image: '../../assets/icons/api_error.png',
              duration: settings.shortToastSec
            })
          } else {
            wx.setStorageSync('logined', true)
          }
        } catch (e) {
          console.error(e)
        }
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  setLanguage: function () {
    let locale = wx.getStorageSync('locale')
    if (!locale) {
      if (this.globalData.systemInfo.language.includes('zh')) {
        locale = 'zh-CN'
      } else {
        locale = 'en-US'
      }
      wx.setStorageSync('locale', locale)
    }
  },
  globalData: {
    userInfo: null,
    submitedFormIds: [],
    systemInfo: {},
    locale: 'zh'
  }
})