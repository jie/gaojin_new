import {
  apiGetActivity,
  apiSearchForm,
  apiSearchUserFormData,
  apiSearchUserLastSubmitForm
} from '../../after_lib/api'
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'
import { compareKey, compareKeyByTime } from '../../libs/arrUtils'
const WxParse = require('../../libs/wxParse/wxParse.js');
import moment from '../../libs/moment.min.js'
const QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
import { compareByIntKey } from '../../libs/arrUtils'
import PageBehavior from '../../utils/page_behaviors'
import mergePages from '../../libs/objectUtils'

const MapScale = 16
var qqmapsdk;
// EhpAzQIgbiKSClIWy3EcwHfkVbdAX2
// meta类型
// 5-主办方
// 7-合办方
// 9-赞助方
// 11-协办方
// 12-指导单位
// 14-联合主办方
// 16-新闻媒体
// 50-电话
// 52-邮箱
// 54-地址
// 56-官网
// 58-微信
// 60-QQ


const PageObject = mergePages({}, PageBehavior, {
  data: {
    pageName: 'event_detail',
    activity: null,
    content: '',
    summary: '',
    title: '',
    replyNum: null,
    canListFormRegister: "1",
    ORG_METAS: {
      "5": 5, "7": 7, "9": 9, "11": 11, "12": 12, "14": 14, "16": 16
    },
    CONTACT_METAS: {
      '50': 50,
      '52': 52,
      '54': 54,
      '56': 56,
      '58': 58,
      '60': 60
    },
    signupLabel: '',
    isRegisted: '0',
    formDataRowId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */

  getEntity: async function (actvtId) {
    this.showLoading({})
    try {
      let result = await apiGetActivity(actvtId)
      if (!result.status) {
        this.showToast(result.info)
        this.hideLoading()

      }

      let data = {}
      if (this.data.locale == 'zh-CN') {
        data = {
          ...result.data,
          metas: result.data.metas,
          cityName: result.data.displayCityName,
          parentCityName: result.data.displayParentCityName,
          _eventDate: this.formatEventDate(result.data.displayActvtStartTime, result.data.displayActvtEndTime)
        }
      } else {
        data = {
          ...result.data,
          metas: result.data.metas,
          cityName: result.data.displayCityEnName,
          parentCityName: result.data.displayParentCityEnName,
          _eventDate: this.formatEventDate(result.data.displayActvtStartTime, result.data.displayActvtEndTime)
        }
      }

      this.setData({
        activity: data
      })
      this.getMetas()
      this.getAgenda()
      this.getActivityTime()

      const vm = this;
      WxParse.wxParse('content', 'html', this.data.activity.actvtDetail, vm, 5);

      if (this.data.activity.actvtSummary) {
        WxParse.wxParse('summary', 'html', this.data.activity.actvtSummary, vm, 5);
      }

      this.setData({
        'activity.actvtGuest': this.data.activity.actvtGuest.sort(compareKey('sortNum'))
      })

      if (this.data.activity.formId) {
        let formResult = await this.getForm(this.data.activity.formId)
        if (formResult.status) {
          await this.getUserSubmitData(this.data.activity.formId)
        }
      }
    } catch (e) {
      console.info(e)
    }
    this.hideLoading()
  },
  getUserSubmitData: async function (formid) {
    let result = null
    if (!this.data.formDataRowId) {
      try {
        result = await apiSearchUserLastSubmitForm({ formId: formid })
      } catch (e) {
        console.error(e)
      }
      console.log('dasdasdas:', result)
      if (result === null || !result.status) {
        if (!result.errorCode && result.info != "找不到相应数据。") {
          this.showErrMsg(result.info)
          return
        }
        this.setData({
          signupLabel: this.data.language.signup,
          isRegisted: '0'
        })
      } else {

        if (result.returnData.errorCode) {
          this.setData({
            signupLabel: this.data.language.signup,
            isRegisted: '0'
          })
          return
        }


        if (this.data.isPayRequired == false) {
          this.setData({
            signupLabel: this.data.language.registed,
            isRegisted: '1'
          })
        } else {
          if (!result.returnData.formData.buyOrder || result.returnData.formData.buyOrder.orderStatus == 5 || result.returnData.formData.buyOrder.orderStatus == 15) {
            this.setData({
              signupLabel: this.data.language.wait_for_payment,
              isRegisted: '3'
            })
          } else if (result.returnData.formData.buyOrder && (result.returnData.formData.buyOrder.orderStatus == 10 || result.returnData.formData.buyOrder.orderStatus == 20)) {
            this.setData({
              signupLabel: this.data.language.registed,
              isRegisted: '2'
            })
          } else {
            this.setData({
              signupLabel: this.data.language.registed,
              isRegisted: '1'
            })
          }
        }
      }
    } else {
      try {
        result = await apiSearchUserFormData({ formId: formid, formDataRowIds: [this.data.formDataRowId] })
      } catch (e) {
        console.error(e)
      }

      if (result === null || !result.status) {
        if (result.info != "找不到相应数据。") {
          this.showErrMsg(result.info)
          return
        }
        this.setData({
          signupLabel: this.data.language.signup,
          isRegisted: '0'
        })
      } else {
        if (this.data.isPayRequired == false) {
          this.setData({
            signupLabel: this.data.language.registed,
            isRegisted: '1'
          })
        } else {
          if (!result.returnData.formDatas[0].buyOrder || result.returnData.formDatas[0].buyOrder.orderStatus == 5 || result.returnData.formDatas[0].buyOrder.orderStatus == 15) {
            this.setData({
              signupLabel: this.data.language.wait_for_payment,
              isRegisted: '3'
            })
          } else if (result.returnData.formDatas[0].buyOrder && (result.returnData.formDatas[0].buyOrder.orderStatus == 10 || result.returnData.formDatas[0].buyOrder.orderStatus == 20)) {
            this.setData({
              signupLabel: this.data.language.registed,
              isRegisted: '2'
            })
          } else {
            this.setData({
              signupLabel: this.data.language.registed,
              isRegisted: '1'
            })
          }
        }
      }
    }

  },
  getForm: async function (formid) {
    let result = await apiSearchForm(formid)
    if (!result.status) {
      this.showToast(result.info)
    } else {
      let isPayRequired = false
      for (let item of result.data.formView.cpnts) {
        if (item.type == 'goods') {
          isPayRequired = true
          break
        }
      }
      this.setData({
        replyNum: result.data.replyNum,
        canListFormRegister: result.data.formView.canListFormRegister,
        isPayRequired: isPayRequired
      })
    }
    return result
  },

  getMetas: function () {
    let metas = []
    let myMetas = {}
    let hasContactInfo = false
    let hasOrgMetaInfo = false
    this.setData({
      'activity.metas': this.data.activity.metas.sort(compareByIntKey('metaType'))
    })
    if (this.data.activity.metas && this.data.activity.metas.length != 0) {
      for (let item of this.data.activity.metas) {
        if (!myMetas[item.metaType]) {
          myMetas[item.metaType] = [item]
        } else {
          myMetas[item.metaType].push(item)
        }

        if (this.data.ORG_METAS[item.metaType] >= 0) {
          hasOrgMetaInfo = true
        }

        if (this.data.CONTACT_METAS[item.metaType] >= 0) {
          hasContactInfo = true
        }
      }
    }

    this.setData({
      'activity.hasContactInfo': hasContactInfo,
      'activity.hasOrgMetaInfo': hasOrgMetaInfo,
      'myMetas': myMetas
    })
  },

  _addAgenda: function (days, day, agenda) {
    for (let item of days) {
      console.log('******* aganda **********')
      console.log(item)
      if (item.actvtDate == day) {
        item.agendas.push({
          startAt: moment(agenda.displayAgendaStartTime).format('HH:mm'),
          endAt: moment(agenda.displayAgendaEndTime).format('HH:mm'),
          topic: agenda.agendaTopic,
          detail: agenda.agendaDetail
        })
        return
      }
    }
    let displayDate = moment(day).format('YYYY/MM/DD')
    if (agenda.displayAgendaEndTime) {
      if (moment(agenda.displayAgendaStartTime).format('YYYYMMDD') != moment(agenda.displayAgendaEndTime).format('YYYYMMDD')) {
        displayDate = `${moment(agenda.displayAgendaStartTime).format('YYYY/MM/DD')} ~ ${moment(agenda.displayAgendaEndTime).format('YYYY/MM/DD')}`
      }
    }
    days.push({
      actvtDate: day,
      displayDate: displayDate,
      agendas: [{
        startAt: moment(agenda.displayAgendaStartTime).format('HH:mm'),
        endAt: moment(agenda.displayAgendaEndTime).format('HH:mm'),
        topic: agenda.agendaTopic,
        detail: agenda.agendaDetail
      }]
    })
  },
  _checkSortNum: function (agendas) {
    let isSortByNum = false
    for (let item of agendas) {
      if (item.sortNum !== "1") {
        return true
      }
    }
    return isSortByNum
  },
  getAgenda: function () {
    let days = []
    if (this._checkSortNum(this.data.activity.actvtAgenda)) {
      this.data.activity.actvtAgenda.sort(compareKey('sortNum'))
    } else {
      this.data.activity.actvtAgenda.sort(compareKeyByTime('displayAgendaStartTime'))
    }

    for (let item of this.data.activity.actvtAgenda) {
      if (item.displayAgendaStartTime) {
        var day = moment(item.displayAgendaStartTime).format('YYYYMMDD')
        this._addAgenda(days, day, item)
      }
    }

    this.setData({
      'activity.agendas': days
    })
  },
  getActivityTime: function () {
    if (this.data.activity.displayActvtStartTime) {
      this.setData({
        'activity.startTime': moment(this.data.activity.displayActvtStartTime).format('YYYY/MM/DD HH:mm')
      })
    }
    if (this.data.activity.displayActvtEndTime) {
      this.setData({
        'activity.endTime': moment(this.data.activity.displayActvtEndTime).format('YYYY/MM/DD HH:mm')
      })
    }
  },

  goHome: function () {
    wx.switchTab({
      url: this.data.settings.HOME_URL,
    })
  },
  goShare: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  goSignup: function (e) {
    let that = this
    let formId = e.target.dataset.formid
    let actvtId = this.data.activity.actvtId
    if (this.data.activity.outsideRegLink) {
      this.showDialog({
        content: '小程序禁止该URL访问，请尝试PC端'
      })
      return
    }
    if (this.data.isRegisted == '1') {
      this.showDialog({
        content: that.data.language.already_registed_note,
        onConfirm(e) {
          wx.navigateTo({
            url: `/pages/signup/signup?formid=${formId}&actvtId=${actvtId}&isLoadLast=1`
          })
        }
      }, true)
    } else if (this.data.isRegisted == '2') {
      this.showDialog({
        content: that.data.language.already_registed_note,
        onConfirm(e) {
          wx.navigateTo({
            url: `/pages/signup/signup?formid=${formId}&actvtId=${actvtId}&isLoadLast=1`
          })
        }
      }, true)
    } else if (this.data.isRegisted == '3') {
      wx.navigateTo({
        url: `/pages/signup/signup?formid=${formId}&actvtId=${actvtId}&isLoadLast=1`
      })
    } else {
      wx.navigateTo({
        url: `/pages/signup/signup?formid=${formId}&actvtId=${actvtId}`
      })
    }
  },
  goGuestDetail: function (e) {
    wx.navigateTo({
      url: `/pages/guest_detail/guest_detail?actvtId=${this.data.activity.actvtId}&guestId=${e.target.dataset.guest.guestId}`,
    })
  },
  goEventMap: function (e) {
    wx.showLoading({
      title: this.data.language.base.loading,
    })
    let address = this.data.activity.actvtAddress
    let city = `${this.data.activity.displayParentCityName} ${this.data.activity.displayCityName}`
    qqmapsdk.geocoder({
      address: `${city} ${address}`,
      success: function (res) {
        wx.openLocation({
          latitude: res.result.location.lat,
          longitude: res.result.location.lng,
          address: address,
          name: city,
          scale: MapScale
        })
      },
      fail: function (res) {
        this.showToast(res)
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  goReplyList: function () {
    wx.navigateTo({
      url: `/pages/replies/replies?formId=${this.data.activity.formId}&count=${this.data.replyNum}`,
    })
  },

  _onLoad: function (options) {
    this.getEntity(options.actvtId)
    this.setData({
      signupLabel: this.data.language.signup,

    })
    if (options.formDataRowId) {
      this.setData({
        formDataRowId: options.formDataRowId
      })
    }
    qqmapsdk = new QQMapWX({
      key: this.data.settings.ttMapKey
    })
  }
})

Page(PageObject)
