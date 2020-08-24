import {
  apiSearchFormReplyStatistics,
  apiSearchFormRegister
} from '../../after_lib/api'
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'
import moment from '../../libs/moment.min.js'
import PageBehavior from '../../utils/page_behaviors'
import mergePages from '../../libs/objectUtils'

const PageObject = mergePages({}, PageBehavior, {
  data: {
    pageName: "replies",
    entities: [],
    formId: null,
    count: null
  },
  getEntities: async function () {
    let result = await apiSearchFormRegister({
      formId: this.data.formId
    })
    if (result.status) {
      this.setData({
        entities: result.returnData.formDatas
      })
    }
  },
  _onLoad: function (options) {
    this.getLanguage()
    this.setData({
      formId: options.formId,
      count: options.count
    })
    if (options.formId) {
      this.getEntities()
    }
  }
})

Page(PageObject)