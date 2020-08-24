import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'
// import {  } from '../../after_lib/api'
import PageBehavior from '../../utils/page_behaviors'
import mergePages from '../../libs/objectUtils'

const PageObject = mergePages({}, PageBehavior, {
  data: {
    next_url: null
  },

  _onLoad: function (options) {
    if(options.next_url) {
      this.setData({
        next_url: decodeURIComponent(options.next_url)
      })
    } else {
      wx.navigateBack()
    }
  }
})

Page(PageObject)