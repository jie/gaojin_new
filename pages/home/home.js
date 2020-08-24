import {
  apiGetTopActvt
} from '../../after_lib/api'
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'
import moment from '../../libs/moment.min.js'
import PageBehavior from '../../utils/page_behaviors'
import mergePages from '../../libs/objectUtils'

const PageObject = mergePages({}, PageBehavior, {
  data: {
    pageName: 'home',
    images: [],
    grid: [],
    carouselHeight: 200
  },

  goContacts: function () {
    wx.switchTab({
      url: '/pages/contacts/contacts',
    })
  },
  _onLoad: function (options) {
    this.getLanguage()
    this.setData({
      carouselHeight: parseInt(this.data.systemInfo.windowWidth * 5 / 9)
    })
    this.getTopEntities()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getLanguage()
    this.setTabLocale()
    this.setGrids()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getTopEntities()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  setGrids: function () {
    let grids = [{
      title: this.data.language.discovery,
      image: '/assets/icons/school-on.png'
    },
    {
      title: this.data.language.university,
      image: '/assets/icons/org-on.png'
    },
    {
      title: this.data.language.my_class,
      image: '/assets/icons/class-on.png'
    },
    {
      title: this.data.language.contacts,
      image: '/assets/icons/contact-on.png'
    },
    {
      title: this.data.language.groups,
      image: '/assets/icons/group-on.png'
    },
    {
      title: this.data.language.jobs,
      image: '/assets/icons/offer-on.png'
    }]
    this.setData({
      grids: grids
    })
  },
  getTopEntities: async function () {
    // wx.showLoading({
    //   title: this.data.language.base.loading,
    // });

    let languageTypes = this.data.locale == 'zh-CN' ? '1' : '2'
    let res = await apiGetTopActvt([languageTypes])
    if (!res.status) {
      this.showToast(res.info)
      return
    }

    let images = []
    for (let item of res.returnData) {
      if (moment().isBefore(moment(item.displayActvtEndTime))) {
        images.push({
          'id': item.actvtId,
          'url': item.actvtView.actvtCover[0].accessUrl,
          'itemid': item.actvtId
        })
      }
    }
    this.setData({
      images: images
    })
  }
});


Page(PageObject)