import { apiGetPtk, apiGetSysDfvs, apiSearchActvt, apiGetThirdAccessWxSpUserLoginInfo, apiSearchThirdAccessCfg, apiThirdpartyWxLogin } from '../../after_lib/api'
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'
import { $wuxToast } from '../../dist/index'
import settings from '../../settings/index'
import PageBehavior from '../../utils/page_behaviors'
const app = getApp()

Page({

  ...PageBehavior,
  data: {
    pageName: 'landing',
    language: {},
    locale: null,
    isSuccess: true,
    next_url: null
  },
  onLoad: function (options) {
    const scene = decodeURIComponent(options.scene)
    console.log('****** scene ******')
    console.log(scene)
    console.log('****** options ******')
    console.log(options)
    if (scene && scene != 'undefined') {
      this.parseSysConfig(scene)
    }
    if (options.next_url) {
      this.setData({
        next_url: options.next_url
      })
    }
  },
  parseSysConfig: function (sysstr) {
    let opCliId = sysstr.substring(0, 16)
    let cfgId = sysstr.substring(16, sysstr.length)
    console.log('opCliId:', opCliId)
    console.log('cfgId:', cfgId)
    wx.setStorage({
      key: 'sys_config',
      data: {
        opCliId: opCliId,
        cfgId: cfgId
      },
    })
  },
  startLogin: function (next_url) {
    let that = this
    wx.login({
      success: async function (res) {
        try {
          let result = await apiThirdpartyWxLogin(res.code)
          if (!result.status) {
            that.setData({
              isSuccess: false
            })
            wx.showToast({
              title: 'wxlogin_fail',
              image: '../../assets/icons/api_error.png',
              duration: settings.shortToastSec
            })
          } else {
            that.setData({
              isSuccess: true
            })
            wx.setStorageSync('logined', true)
            console.log('next_url:', next_url)
            await apiSearchThirdAccessCfg()
            if(!next_url) {
              wx.switchTab({
                url: settings.HOME_URL
              })
              return
            }
            
            let decodeNextUrl = decodeURIComponent(next_url)
            if (that.isTab(decodeNextUrl)) {
              wx.switchTab({
                url: decodeNextUrl
              })
            } else {
              wx.redirectTo({
                url: decodeNextUrl
              })
            }

          }
        } catch (e) {
          console.log('====== error =======')
          console.log('e:', e)
          that.setData({
            isSuccess: false
          })
        }
      },
      complete: () => {
        setInterval(() => {
          wx.login({
            success: async (res) => {
              await apiThirdpartyWxLogin(res.code)
            }
          })
        }, 1000 * 60 * 5)
      },
      fail: () => {
        that.setData({
          isSuccess: false
        })
      }
    })
  },
  isTab: function (url) {
    let flag = false;
    for (let item of settings.TAB_URLS) {
      if (url.includes(item)) {
        return true
      }
    }
    return flag
  },
  reloadApp: function () {
    if (this.data.next_url) {
      wx.reLaunch({
        url: `/pages/landing/landing?next_url=${this.data.next_url}`
      })
    } else {
      wx.reLaunch({
        url: '/pages/landing/landing'
      })
    }
  },
  onShow: function () {
    this.getLanguage()
    if (settings.ThirdPartyLandingUrl) {
      if (this.data.next_url) {
        wx.navigateTo({
          url: `${settings.ThirdPartyLandingUrl}?next_url=${this.data.next_url}`,
        })
      } else {
        wx.navigateTo({
          url: settings.ThirdPartyLandingUrl,
        })
      }

    } else {
      this.startLogin(this.data.next_url)
    }
  }
})
