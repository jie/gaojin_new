import PageBehavior from '../../utils/page_behaviors'
import mergePages from '../../libs/objectUtils'

const PageObject = mergePages({}, PageBehavior, {

  data: {
    url: null,
    pageName: 'home_kedge'
  },

  changeLocale: function (locale) {
    if (!locale) {
      locale = wx.getStorageSync('locale') || 'zh-CN'
    }
    wx.setStorageSync('locale', locale)
    this.getLanguage()
    this.setTabLocale(locale)
    this.setNavTitle()
  },
  _onLoad: function (options) {
    this.changeLocale(options.locale)
  },
  onShow: function () {
    let locale = wx.getStorageSync('locale')
    if (locale == 'en-US') {
      this.setData({
        url: 'https://wx.aemba.com.cn/en/about_contact.php'
      })
    } else {
      this.setData({
        url: 'https://wx.aemba.com.cn/about_contact.php'
      })
    }
  }

})

Page(PageObject)