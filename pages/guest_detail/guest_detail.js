import {
  apiGetActivity
} from '../../after_lib/api'
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'
import PageBehavior from '../../utils/page_behaviors'
import mergePages from '../../libs/objectUtils'

const PageObject = mergePages({}, PageBehavior, {
  data: {
    pageName: 'guest_detail',
    guest: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  _onLoad: function (options) {
    this.setData({
      guestId: options.guestId,
      actvtId: options.actvtId
    })
    this.getEntity()
  },

  getEntity: async function () {
    let result = await apiGetActivity(this.data.actvtId)
    if (!result.status) {
      this.showToast(result.info)
      return
    }

    if (result.data.actvtGuest && result.data.actvtGuest.length != 0) {
      for (let item of result.data.actvtGuest) {
        if (item.guestId == this.data.guestId) {
          this.setData({
            guest: item
          })
          console.log(this.data.guest)
        }
      }
    }
  }
})

Page(PageObject)