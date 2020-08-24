import settings from '../../settings/index'
import { $wuxActionSheet } from '../../dist/index'
import PageBehavior from '../../utils/page_behaviors'
import mergePages from '../../libs/objectUtils'

const PageObject = mergePages({}, PageBehavior, {
  data: {
    pageName: 'mine',
    sysConfig: null,
  },

  showVersionInfo: function () {
    wx.showModal({
      title: 'System Info',
      content: `cfgId: ${this.data.sysConfig.cfgId}\r\nopCliId: ${this.data.sysConfig.opCliId}`,
      showCancel: false
    })
  },
  getCurrentConfigs: function () {
    let sysConfig = wx.getStorageSync('sys_config')
    if (sysConfig) {
      this.setData({
        sysConfig: sysConfig
      })
    } else {
      this.setData({
        sysConfig: {
          cfgId: settings.cfgId,
          opCliId: settings.opCliId
        }
      })
    }
  },

  _onLoad: function (options) {
    this.getLanguage()
    this.getCurrentConfigs()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getLanguage()
  },

  goMineSettings: function () {
    wx.navigateTo({
      url: '/pages/mine_settings/mine_settings',
    })
  },
  goMineDetail: function () {
    wx.navigateTo({
      url: '/pages/mine_detail/mine_detail',
    })
  },
  clickTest: function () {
    wx.navigateTo({
      url: '/pages/testing/testing',
    })
  },
  showLanguageSheet() {
    wx.showActionSheet({
      itemList: ['中文', 'English'],
      cancelText: this.data.language.cancel,
      success: (res) => {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          wx.setStorageSync('locale', 'zh-CN')
        } else if (res.tapIndex == 1) {
          wx.setStorageSync('locale', 'en-US')
        }
        this.getLanguage()
        this.setTabLocale('en-US')
        this.setNavTitle()
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
    // $wuxActionSheet().showSheet({
    //   theme: 'wx',
    //   buttons: [{
    //     text: '中文'
    //   },
    //   {
    //     text: 'English'
    //   }],
    //   cancelText: this.data.language.cancel,
    //   cancel() {},
    //   buttonClicked: (index, item)=> {
    //     console.log(index)
    //     if(index == 0) {
    //       wx.setStorageSync('locale', 'zh-CN')
    //     } else if(index == 1) {
    //       wx.setStorageSync('locale', 'en-US')
    //     }
    //     this.getLanguage()
    //     this.setTabLocale('en-US')
    //     this.setNavTitle()
    //     return true
    //   }
    // })
  },
  jumpToPorject(){
    wx.navigateTo({
      url:  '/pages/signup/signup?formid=1huowz7ek16vb15qwzv1dj1cyl9r7a53'
    })
  },
  jumpRecommend(){
    wx.navigateTo({
      url:  '/pages/signup/signup?formid=lg968kkm02ifv4tjeaw1407dyfc5t73f'
    })
  }
})


Page(PageObject)