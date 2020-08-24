import {
  apiSearchForm,
  apiSearchUserLastSubmitForm
} from '../../after_lib/api'
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'
import moment from '../../libs/moment.min.js'
import PageBehavior from '../../utils/page_behaviors'
import mergePages from '../../libs/objectUtils'

const PageObject = mergePages({}, PageBehavior, {
  data: {
    pageName: 'form_feedback',
    feedback: null,
    formid: null,
    formDataRowId: null,
    cpntDatas: [],
    formOptionMap: {}
  },

  _onLoad: function (options) {
    this.setData({
      formid: options.formid,
      formDataRowId: options.formDataRowId
    })
    this.getLanguage()
    this.getFormFeedback()
  },

  onPullDownRefresh: function () {
    this.getFormFeedback()
    wx.stopPullDownRefresh()
  },

  getForm: async function() {
    let res = null
    try {
      res = await apiSearchForm(this.data.formid)
    } catch (e) {
      console.error(e)
    }

    if (!res.status) {
      this.showToast(res.info)
      return
    }
    console.log('getForm:', res)
    this.setData({
      formData: res.data
    })
    let formOptionMap = {}
    for(let item of res.data.formView.cpnts) {
      formOptionMap[item.cpntId] = item
    }
    this.setData({
      formOptionMap: formOptionMap
    })
  },
  getFormFeedback: async function () {
    await this.getForm(this.data.formid)
    let res = null
    try {
      res = await apiSearchUserLastSubmitForm({ formId: this.data.formid })
    } catch (e) {
      console.error(e)
    }

    if (!res.status) {
      this.showToast(res.info)
      return
    }
    console.log('getFormFeedback:', res)
    this.setData({
      feedback: res.returnData.formData
    })
    let cpntDatas = []
    for(let item of res.returnData.formData.dataRowDetail.cpntTitles) {
      var cpntSettings = this.data.formOptionMap[item.cpntId]
      if(!cpntSettings) {
        continue
      }
      console.log('cpntSettings:', cpntSettings)
      var cpntItem = {
        title: item.cpntTitle,
        values: [],
        settings: cpntSettings
      }
      for(let value of res.returnData.formData.values) {
        if(value.cpntId == item.cpntId) {
          if(cpntSettings.type == 'imgRadio' || cpntSettings.type == 'imgCheckbox') {
            for(let opt of cpntSettings.imgOptions) {
              if(opt.optId == value.cpntOptId) {
                cpntItem.values.push({
                  title: value.dataValue,
                  image: opt.accessUrl
                })
              }
            }

          } else {
            cpntItem.values.push(value.dataValue)
          }
        }
      }
      cpntDatas.push(cpntItem)
    }
    console.log('cpntDatas:', cpntDatas)
    this.setData({
      cpntDatas: cpntDatas
    })
  },
  onPreviewImage: function(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.imageurl],
    })
  }
});


Page(PageObject)