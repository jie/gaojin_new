import moment from '../../../libs/moment.min.js'
import { compareKey, compareByIntKey } from '../../../libs/arrUtils'
import language from '../language'
import settings from '../../../settings/index'
Component({

  properties: {
    language: {
      type: Object,
      value: {}
    },
    formObj: {
      type: Object,
      value: null
    },
    formData: {
      type: Array,
      value: []
    },
    toastDuration: {
      type: Number,
      value: 4000
    },
    scrollDuration: {
      type: Number,
      value: 300
    },
    fileLimitMsg: {
      type: String,
      value: ''
    },
    locale: {
      type: String,
      value: 'zh-CN'
    },
    enviroment: {
      type: String,
      value: ''
    },
    style: {
      type: Object,
      value: {}
    }
  },

  data: {
    valueObjs: {},
    formCpnts: [],
    componentPositions: {},
    componentMap: {
      radio: 'radio',
      att: 'att',
      checkbox: 'checkbox',
      date: 'date',
      select: 'select',
      cutoff: 'cutoff',
      text: 'text',
      textarea: 'textarea',
      score: 'score',
      email: 'text',
      fax: 'text',
      mobile: 'text',
      number: 'number',
      qq: 'text',
      tel: 'text',
      weixin: 'text',
      cttCorp: 'text',
      cttUrl: 'text',
      cttAddress: 'text',
      cttBirth: 'cttBirth',
      cttLocation: 'cttLocation',
      cttName: 'text',
      cttNote: 'text',
      cttPosition: 'text',
      cttSex: 'cttSex',
      sourceTag: 'sourceTag',
      sourceCttEmail: 'text',
      sourceCttName: 'text',
      sourceCttMobile: 'text',
      img: 'img',
      imgRadio: 'imgRadio',
      imgCheckbox: 'imgCheckbox',
      goods: 'goods'
    }

  },
  attached: function () {
    this.initialize()
  },
  ready: function () {
    this.getLanguage()
    setTimeout(() => {
      this.getComponentPositions()
    }, 1000)
  },
  methods: {
    initialize: function () {
      let cpnts = []
      let formData = []
      if (this.data.formObj && this.data.formObj.formView.cpnts && this.data.formObj.formView.cpnts.length != 0) {
        cpnts = this.data.formObj.formView.cpnts

        for (let cpnt of cpnts) {
          if (cpnt.goodsOptions && cpnt.goodsOptions.length !== 0) {
            for (var j = 0; j < cpnt.goodsOptions.length; j++) {
              if (cpnt.goodsOptions[j].optStatus == 2) {
                console.log(cpnt.goodsOptions[j])
                cpnt.goodsOptions.splice(j, 1);
              }
            }
          }
        }
        cpnts.sort(compareByIntKey('sortNum'))
      }
      this.setData({
        formCpnts: cpnts,
        formData: formData
      })
    },

    getLanguage: function () {
      if (language[this.data.locale] && language[this.data.locale]['form']) {
        this.setData({
          language: {
            ...language[this.data.locale]['form'],
            base: language[this.data.locale].base
          }
        })
      } else {
        this.setData({
          language: {
            base: language[this.data.locale].base
          }
        })
      }
    },
    getComponentPositions: function () {
      let positions = {}
      const query = this.createSelectorQuery()
      query.select('#Afform').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec((res) => {
        console.log(res)
      })
      for (let item of this.data.formCpnts) {
        var cQuery = this.createSelectorQuery()
        if (!cQuery.select(`#${item.cpntId}`)) {
          continue
        }
        cQuery.select(`#FORM_${item.cpntId}`).boundingClientRect()
        cQuery.selectViewport().scrollOffset()
        cQuery.exec(function (res) {
          // console.log(res)
          positions[item.cpntId] = {
            title: item.title,
            data: res[0]
          }
        })
      }
      this.setData({
        componentPositions: positions
      })
    },
    onChangeField: function (e) {

      let valueObjs = {}
      let actionType = e.detail.actionType
      if (actionType == 'AF_FORM_VALIDATE_ERR') {
        this.triggerEvent("action", {
          actionType: actionType,
          message: e.detail.message
        })
        return
      }

      if (actionType == 'AF_FORM_ATT_UPLOAD_SUCCESS') {
        console.log('AF_FORM_ATT_UPLOAD_SUCCESS:', e)
        console.log(e)
        this.triggerEvent("action", e.detail)
      }

      if (actionType == 'AF_FORM_ATT_UPLOAD_FAIL') {
        this.triggerEvent("action", e.detail)
        return
      }

      let valueExist = false
      let formData = this.data.formData

      console.log('detail:', e)
      valueObjs[e.detail.cpntId] = e.detail.value
      for (let i = 0; i < formData.length; i++) {
        console.log('item:', formData[i])
        if (formData[i].cpntId == e.detail.cpntId) {
          if(e.detail.dataField) {
            formData[i][e.detail.dataField] = e.detail.value
          } else if(e.detail.otherDataValue !== undefined && e.detail.otherDataValue !== ''){
            formData[i]['otherDataValue'] = e.detail.value
          }
          
          valueExist = true
        }
      }

      if (!valueExist) {
        let comValue = { cpntId: e.detail.cpntId }
        comValue[e.detail.dataField] = e.detail.value
        formData.push(comValue)
      }

      this.setData({
        formData: formData,
        valueObjs: valueObjs,
      })
    },

    _submitFormAPI: function (withNotify) {
      console.log('==== submitSignupForm formData ====')
      console.log(this.data.formData)
      let result;
      let formCpnts = this.data.formCpnts
      let coms = []
      let scrollTop = null
      for (let i = 0; i < formCpnts.length; i++) {
        const com = this.selectComponent(`#FORM_${formCpnts[i].cpntId}`)
        if (com && com.validate) {
          result = com.validate()
          if (result && result.status === false) {
            if (scrollTop === null) {
              scrollTop = this.data.componentPositions[formCpnts[i].cpntId].data.top
            }
          }
        }
      }
      if (scrollTop !== null) {
        wx.pageScrollTo({
          scrollTop: scrollTop,
          duration: this.data.scrollDuration
        })
      } else {
        // this.updateValueObjs()
        this.triggerEvent("action", {
          actionType: 'AF_FORM_SUBMIT',
          formData: this.data.formData,
          withNotify: withNotify
        })
      }

    },
    submitSignupForm: function (e) {
      console.log('sendTplMsgByWxspAfterSubmit:', this.data.formObj.formView.sendTplMsgByWxspAfterSubmit)
      if (this.data.formObj.formView.sendTplMsgByWxspAfterSubmit == 1) {

        let accessCfg = wx.getStorageSync('accessCfg')
        if (accessCfg && accessCfg.tplMsgIdForFormReplyConfirmInWxsp) {
          wx.requestSubscribeMessage({
            tmplIds: [accessCfg.tplMsgIdForFormReplyConfirmInWxsp],
            success: (res) => {
              this._submitFormAPI(true)
            }
          })
        } else {
          this._submitFormAPI()
        }
      } else {
        this._submitFormAPI()
      }
    }
  }
})
