import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'
import { apiSearchArtc } from '../../after_lib/api'
import PageBehavior from '../../utils/page_behaviors'
import mergePages from '../../libs/objectUtils'
import moment from '../../libs/moment.min.js'
var WxParse = require('../../libs/wxParse/wxParse.js');

const PageObject = mergePages({}, PageBehavior, {
  data: {
    pageName: "news_detail",
    entity: null,
    content: null,
    intro: null
  },
  getEntity: async function (artcId) {
    let result = await apiSearchArtc({artcIds: [artcId]})
    if (!result.status) {
      this.showToast(result.info)
      return
    }
    let data = result.returnData.artcs[0]
    if(data.displayPubTime) {
      data._createAt = moment(data.displayPubTime).format('YYYY-MM-DD')
    }
    
    this.setData({
      entity: data
    })
    var vm = this;
    WxParse.wxParse('content', 'html', this.data.entity.artcDetail, vm, 5);
    WxParse.wxParse('intro', 'html', this.data.entity.artcSummary, vm, 5);
  },
  _onLoad: function (options) {
    this.getEntity(options.artcId)
  }
})
Page(PageObject)