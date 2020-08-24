// import language from './language'
// import tabs from '../utils/tabs'
// import settings from '../settings/index'
// import { $wuxToast } from '../dist/index'
// import { $wuxDialog } from '../dist/index'
// import { $wuxLoading } from '../dist/index'
// import moment from '../libs/moment.min.js'

// const app = getApp()


// module.exports = {
//   data: {
//     pageName: null,
//     language: {},
//     locale: null,
//     systemInfo: app.globalData.systemInfo,
//     settings: settings,
//     campusServerAddr: settings.campusServerAddr,
//     userInfo: null
//   },
//   showToast(info) {
//     $wuxToast().show({
//       type: 'text',
//       duration: this.data.settings.shortToastSec,
//       color: '#fff',
//       text: info
//     })
//   },
//   showErrMsg(code) {
//     if(this.data.language.errMsg[code]) {
//       this.showToast(this.data.language.errMsg[code])
//     } else {
//       this.showToast(`UNKNOWN_ERR_CODE_${code}`)
//     }
//   },
//   showDialog(newConfig, isConfirm=false) {
//     let config = Object.assign({}, 
//       {
//         resetOnClose: true,
//         title: '',
//         content: ''
//       },
//       newConfig
//     )
//     if(isConfirm) {
//       $wuxDialog().confirm(config)
//     } else {
//       $wuxDialog().alert(config)
//     }
//   },
//   onReachBottom: function () {
//     wx.stopPullDownRefresh();
//   },
  
//   showLoading(options={}) {
//     this.$wuxLoading = $wuxLoading()
//     this.$wuxLoading.show({
//       text: options.text || this.data.language.base.loading,
//     })
//     if(options.duration) {
//       setTimeout(() => {
//         this.$wuxLoading.hide()
//       }, options.duration)
//     }
//   },
//   hideLoading() {
//     if (this.$wuxLoading) {
//       this.$wuxLoading.hide()
//     }
//   },
//   onLoad: function (options) {
//     console.log(options)
//     console.log(this.data.systemInfo)
//     console.log(`==========${this.data.pageName}===========`)
//     if(this.data.settings.schoolID) {
//       this.setData({
//         schoolID: this.data.settings.schoolID
//       })
//     }

//     if(!this.data.noRequireEducationExp) {
//       this.checkLogined()
//     }
    
//     this.getLanguage()
//     if (this._onLoad) {
//       this._onLoad(options)
//     }
//     if (settings.extraNavStyle) {
//       this.setNavStyle()
//     }
//   },
//   onShow: function() {
//     this.getLanguage()
//   },
//   setNavStyle: function () {
//     let curPath = this.getCurrentPath()
//     for (let url of settings.extraNavStyle.urls) {
//       if (curPath.includes(url)) {
//         wx.setNavigationBarColor({
//           frontColor: settings.extraNavStyle.frontColor,
//           backgroundColor: settings.extraNavStyle.backgroundColor
//         })
//       }
//     }
//   },
//   getLanguage: function () {
//     let locale = wx.getStorageSync('locale')
//     this.setData({
//       language: {
//         ...language[locale][this.data.pageName],
//         base: language[locale].base,
//         errMsg: language[locale].errMsg
//       },
//       locale: locale
//     })
//     this.setNavTitle()
//   },
//   setTabLocale: function () {
//     let locale = wx.getStorageSync('locale')
//     let i = 0
//     for (let item of tabs[locale]) {
//       wx.setTabBarItem({
//         index: i,
//         text: item.text,
//         iconPath: item.icon,
//         selectedIconPath: item.selectedIcon,
//         pagePath: item.pagePath
//       })
//       i++
//     }
//   },
//   setNavTitle: function () {
//     let locale = wx.getStorageSync('locale')
//     if (language[locale] && language[locale][this.data.pageName] && language[locale][this.data.pageName].pageTitle) {
//       wx.setNavigationBarTitle({
//         title: language[locale][this.data.pageName].pageTitle
//       })
//     }
//   },
//   reLaunchPage: function() {
//     let currPage = this.getCurrentPath()
//     console.log('reLaunchPage:', currPage)
//     if(!currPage.includes('landing') && !currPage.includes('regist_wechat')){
//       wx.reLaunch({
//         url: `/pages/landing/landing?next_url=${encodeURIComponent(currPage)}`,
//       })
//     } else {
//       wx.reLaunch({
//         url: `/pages/landing/landing`,
//       })
//     }
//   },
//   checkLogined: function () {
//     let logined = wx.getStorageSync('logined')
//     console.log('logined:', logined)
//     if(settings.ThirdPartyLandingUrl) {
//       let loginInfo = wx.getStorageSync('loginInfo')
//       if(loginInfo && loginInfo.alumniID && loginInfo.alumniToken) { 
//         console.log('thirdpart logined')
//         if(!logined) {
//           console.log(1)
//           wx.navigateTo({
//             url: '/pages/regist_school/regist_school'
//           })
//         }
//       } else {
//         console.log(2)
//         this.reLaunchPage()
//       }
//     } else {
//       console.log(3)
//       if(!logined) {
//         this.reLaunchPage()
//       }
//     }
//   },
//   getCurrentPath: function () {
//     let pages = getCurrentPages();
//     let currPage = null;
//     if (pages.length) {
//       currPage = pages[pages.length - 1];
//     }
//     if (currPage.options) {
//       let queryStr = this.joinUrlKey(currPage.options);
//       return `/${currPage.route}?${queryStr}`
//     } else {
//       return `/${currPage.route}`
//     }
//   },
//   joinUrlKey: function (keys) {
//     return Object.keys(keys).map(function (k) {
//       return encodeURIComponent(k) + "=" + encodeURIComponent(keys[k]);
//     }).join('&')
//   },
//   onShareAppMessage(res) {
//     let url = this.getCurrentPath()
//     return {
//       path: `/pages/landing/landing?next_url=${encodeURIComponent(url)}`
//     }
//   },
//   isTab: function (url) {
//     let flag = false;
//     for (let item of settings.TAB_URLS) {
//       if (url.includes(item)) {
//         return true
//       }
//     }
//     return flag
//   },
//   goToURL: function(url) {
//     console.log('gotourl:', url)
//     let nextURL = url || this.data.settings.HOME_URL
//     console.log('gotourl:', url)
//     console.log('url:', nextURL)
//     if (this.isTab(nextURL)) {
//       wx.switchTab({
//         url: nextURL
//       })
//     } else {
//       wx.redirectTo({
//         url: nextURL
//       })
//     }
//   },
//   getAlumniAvatar(avatar) {
//     if(!avatar || avatar && avatar.length < 10) {
//       return '../../assets/icons/no_user.png'
//     } else if (avatar.includes('wx.qlogo.cn')){
//       return avatar
//     } else {
//       return `${this.data.campusServerAddr}${avatar}`
//     }
//   },
//   getLogo(logo) {
//     if (!logo || logo && logo.length < 10) {
//       return '../../campus_lib/components/experience_box/no_company.png'
//     } else {
//       return `${this.data.campusServerAddr}${logo}`
//     }
//   },
//   getImageURL(url) {
//     if (!url || url && url.length < 10) {
//       return null
//     } else {
//       return `${this.data.campusServerAddr}${url}`
//     }
//   },
//   formatEventDate(s1, e1) {
//     let startDate = moment(s1)
//     let endDate = moment(e1)
//     if(startDate.format('YYYY-MM-DD') == endDate.format('YYYY-MM-DD')) {
//       return `${startDate.format('YYYY-MM-DD HH:mm')}-${endDate.format('HH:mm')}`
//     } else {
//       return `${startDate.format('YYYY-MM-DD HH:mm')}-${endDate.format('YYYY-MM-DD HH:mm')}`
//     }
//   },
//   getDateExperience(start, end) {
//     console.log(end)
//     if (!end || end.length < 3) {
//       return `${start} ~ ${this.data.language.base.to_now}`
//     } else {
//       return `${start} ~ ${end}`
//     }
//   }
// }


import language from './language'
import tabs from '../utils/tabs'
import settings from '../settings/index'
import {
  $wuxToast
} from '../dist/index'
import {
  $wuxDialog
} from '../dist/index'
import {
  $wuxLoading
} from '../dist/index'
import moment from '../libs/moment.min.js'
import {
  mgColorManager
} from './color_manager'

const app = getApp()


module.exports = {
  data: {
    pageName: null,
    language: {},
    locale: null,
    systemInfo: app.globalData.systemInfo,
    settings: settings,
    campusServerAddr: settings.campusServerAddr,
    userInfo: null
  },
  showToast(info) {
    $wuxToast().show({
      type: 'text',
      duration: settings.shortToastSec,
      color: '#fff',
      text: info
    })
  },
  showErrMsg(code) {
    if (this.data.language.errMsg[code]) {
      this.showToast(this.data.language.errMsg[code])
    } else {
      this.showToast(`UNKNOWN_ERR_CODE_${code}`)
    }
  },
  showDialog(newConfig, isConfirm = false) {
    let config = Object.assign({}, {
        resetOnClose: true,
        title: '',
        content: ''
      },
      newConfig
    )
    if (isConfirm) {
      $wuxDialog().confirm(config)
    } else {
      $wuxDialog().alert(config)
    }
  },
  onReachBottom: function () {
    wx.stopPullDownRefresh();
  },

  showLoading(options = {}) {
    this.$wuxLoading = $wuxLoading()
    this.$wuxLoading.show({
      text: options.text || this.data.language.base.loading,
    })
    if (options.duration) {
      setTimeout(() => {
        this.$wuxLoading.hide()
      }, options.duration)
    }
  },
  hideLoading() {
    if (this.$wuxLoading) {
      this.$wuxLoading.hide()
    }
  },
  onLoad: function (options) {
    console.log(options)
    console.log(this.data.systemInfo)
    console.log(`==========${this.data.pageName}===========`)
    if (settings.schoolID) {
      this.setData({
        schoolID: settings.schoolID
      })
    }

    if (!this.data.noRequireEducationExp) {
      this.checkLogined()
    }

    this.getLanguage()
    if (this._onLoad) {
      this._onLoad(options)
    }
    if (settings.extraNavStyle) {
      this.setNavStyle()
    }
  },
  onShow: function () {
    this.getLanguage()
  },
  setNavStyle: function () {
    let curPath = this.getCurrentPath()
    for (let url of settings.extraNavStyle.urls) {
      if (curPath.includes(url)) {
        wx.setNavigationBarColor({
          frontColor: settings.extraNavStyle.frontColor,
          backgroundColor: settings.extraNavStyle.backgroundColor
        })
      }
    }
  },
  getLanguage: function () {
    let locale = wx.getStorageSync('locale')
    if(settings.enviroment == 'ceibs') {
      let lang = {}
      for(let key of Object.keys(language['zh-CN'][this.data.pageName])) {
        lang[key] = `${language['zh-CN'][this.data.pageName][key]} ${language['en-US'][this.data.pageName][key]}`
      }
      let langBase = {}
      for(let key of Object.keys(language['zh-CN'].base)) {
        langBase[key] = `${language['zh-CN'].base[key]} ${language['en-US'].base[key]}`
      }
      let langError = {}
      for(let key of Object.keys(language['zh-CN'].errMsg)) {
        langError[key] = `${language['zh-CN'].errMsg[key]} ${language['en-US'].errMsg[key]}`
      }
      this.setData({
        language: {
          ...lang,
          base: langBase,
          errMsg: langError
        },
        locale: locale
      })
    } else {
      this.setData({
        language: {
          ...language[locale][this.data.pageName],
          base: language[locale].base,
          errMsg: language[locale].errMsg
        },
        locale: locale
      })
    }

    this.setNavTitle()
  },
  setTabLocale: function () {
    let locale = wx.getStorageSync('locale')
    let i = 0
    for (let item of tabs[locale]) {
      wx.setTabBarItem({
        index: i,
        text: item.text,
        iconPath: item.icon,
        selectedIconPath: item.selectedIcon,
        pagePath: item.pagePath
      })
      i++
    }
  },
  setNavTitle: function () {
    let locale = wx.getStorageSync('locale')
    if (language[locale] && language[locale][this.data.pageName] && language[locale][this.data.pageName].pageTitle) {
      if(settings.enviroment == 'ceibs') {
        wx.setNavigationBarTitle({
          title: `${language['zh-CN'][this.data.pageName].pageTitle} ${language['en-US'][this.data.pageName].pageTitle}`
        })
      } else {
        wx.setNavigationBarTitle({
          title: language[locale][this.data.pageName].pageTitle
        })
      }
    }
  },
  changePageLanguage: function (locale) {
    if(settings.enviroment == 'ceibs') {
      let lang = {}
      if(language['zh-CN'][this.data.pageName]) {
        for(let key of Object.keys(language['zh-CN'][this.data.pageName])) {
          lang[key] = `${language['zh-CN'][this.data.pageName][key]} ${language['en-US'][this.data.pageName][key]}`
        }
      }

      let langBase = {}
      if(language['zh-CN'].base) {
        for(let key of Object.keys(language['zh-CN'].base)) {
          langBase[key] = `${language['zh-CN'].base[key]} ${language['en-US'].base[key]}`
        }
      }

      let langError = {}
      if(language['zh-CN'].errMsg) {
        for(let key of Object.keys(language['zh-CN'].errMsg)) {
          langError[key] = `${language['zh-CN'].errMsg[key]} ${language['en-US'].errMsg[key]}`
        }
      }

      this.setData({
        language: {
          ...lang,
          base: langBase,
          errMsg: langError
        },
        locale: locale
      })
    } else {
      this.setData({
        language: {
          ...language[locale][this.data.pageName],
          base: language[locale].base,
          errMsg: language[locale].errMsg
        },
        locale: locale
      })
    }

    this.setNavTitle()
    this.setTabLocale(locale)
  },
  reLaunchPage: function () {
    let currPage = this.getCurrentPath()
    console.log('reLaunchPage:', currPage)
    if (!currPage.includes('landing') && !currPage.includes('regist_wechat')) {
      wx.reLaunch({
        url: `/pages/landing/landing?next_url=${encodeURIComponent(currPage)}`,
      })
    } else {
      wx.reLaunch({
        url: `/pages/landing/landing`,
      })
    }
  },
  checkLogined: function () {
    let logined = wx.getStorageSync('logined')
    console.log('logined:', logined)
    if (settings.ThirdPartyLandingUrl) {
      let loginInfo = wx.getStorageSync('loginInfo')
      if (loginInfo && loginInfo.alumniID && loginInfo.alumniToken) {
        console.log('thirdpart logined')
        if (!logined) {
          wx.navigateTo({
            url: '/pages/regist_school/regist_school'
          })
        }
      } else {
        this.reLaunchPage()
      }
    } else {
      if (!logined) {
        this.reLaunchPage()
      }
    }
  },
  getCurrentPath: function () {
    let pages = getCurrentPages();
    let currPage = null;
    if (pages.length) {
      currPage = pages[pages.length - 1];
    }
    if (currPage.options) {
      let queryStr = this.joinUrlKey(currPage.options);
      return `/${currPage.route}?${queryStr}`
    } else {
      return `/${currPage.route}`
    }
  },
  joinUrlKey: function (keys) {
    return Object.keys(keys).map(function (k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(keys[k]);
    }).join('&')
  },
  onShareAppMessage(res) {
    let url = this.getCurrentPath()
    return {
      path: `/pages/landing/landing?next_url=${encodeURIComponent(url)}`
    }
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
  goToURL: function (url) {
    console.log('gotourl:', url)
    let nextURL = url || settings.HOME_URL
    console.log('gotourl:', url)
    console.log('url:', nextURL)
    if (this.isTab(nextURL)) {
      wx.switchTab({
        url: nextURL
      })
    } else {
      wx.redirectTo({
        url: nextURL
      })
    }
  },
  getAlumniAvatar(avatar) {
    if (!avatar || avatar && avatar.length < 10) {
      return '../../assets/icons/no_user.png'
    } else if (avatar.includes('wx.qlogo.cn')) {
      return avatar
    } else {
      return `${this.data.campusServerAddr}${avatar}`
    }
  },
  getLogo(logo) {
    if (!logo || logo && logo.length < 10) {
      return '../../campus_lib/components/experience_box/no_company.png'
    } else {
      return `${this.data.campusServerAddr}${logo}`
    }
  },
  getImageURL(url) {
    if (!url || url && url.length < 10) {
      return null
    } else {
      return `${this.data.campusServerAddr}${url}`
    }
  },
  formatEventDate(s1, e1) {
    let startDate = moment(s1)
    let endDate = moment(e1)
    if (startDate.format('YYYY-MM-DD') == endDate.format('YYYY-MM-DD')) {
      return `${startDate.format('YYYY-MM-DD HH:mm')}-${endDate.format('HH:mm')}`
    } else {
      return `${startDate.format('YYYY-MM-DD HH:mm')}-${endDate.format('YYYY-MM-DD HH:mm')}`
    }
  },
  getDateExperience(start, end) {
    console.log(end)
    if (!end || end.length < 3) {
      return `${start} ~ ${this.data.language.base.to_now}`
    } else {
      return `${start} ~ ${end}`
    }
  },
  getColors: function (style) {
    var t = style.backgroundColor;
    var n = style.contentBackgroundColor;
    var i = style.formTitleBackgroundColor;
    var a = i;

    if (a = mgColorManager.getColorVal(i, "V") < mgColorManager.getColorVal(t, "V") ? i : t, mgColorManager.getColorVal(a, "V") < 90 || mgColorManager.getColorVal(a, "S") > 10) {
      mgColorManager.setColor(a);
      var o = mgColorManager.getColorGroup();
      if (n == o.BK) {
        return {
          color: '#333',
          backgroundColor: '#fff'
        }
      } else {
        return {
          color: mgColorManager.getColorVal(a, "GY") > 192 ? "#222" : "#fff",
          backgroundColor: o.BK
        }
      }
    }
  }
}