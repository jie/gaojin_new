import PageBehavior from '../../utils/page_behaviors'
import mergePages from '../../libs/objectUtils'

const PageObject = mergePages({}, PageBehavior, {
  data: {
    pageName: 'signup_success',
    msg: ''
  },
  _onLoad: function (options) {
    this.getLanguage()
  },
  onShow: function () {
    let locale = wx.getStorageSync('locale')
    if (this.data.locale != locale) {
      this.getLanguage()
    }

    let msg = wx.getStorageSync('success_submit_msg')
    if (!msg) {
      this.setData({
        msg: this.data.language.submit_success
      })
    } else {
      this.setData({ msg: msg })
      wx.removeStorageSync('success_submit_msg')
    }
  },

  goBack: function () {
    wx.navigateTo({
      url: '/pages/mine_events/mine_events',
    })
  }
})

Page(PageObject)