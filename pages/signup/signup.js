import {
  apiSearchForm,
  apiSubmitFormData,
  apiGetActivity,
  apiGetThirdUserAuthUrlWithSessionInfo,
  apiWxSpStartPayThroughBridge,
  apiSearchUserLastSubmitForm,
  apiGetCurrThirdUserInfo,
  apiSendWxspSubscribeMsg,
  apiSearchThirdAccessCfg,
  apiGetBridgeInfo
} from '../../after_lib/api'
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'
import moment from '../../libs/moment.min.js'
import {
  compareKey
} from '../../libs/arrUtils'
import PageBehavior from '../../utils/page_behaviors'
import mergePages from '../../libs/objectUtils'
import {
  asyncPayment
} from '../../libs/async_payment'


const app = getApp()

const PageObject = mergePages({}, PageBehavior, {
  data: {
    pageName: "signup",
    cpnts: [],
    activity: null,
    formObj: null,
    showForm: true,
    actvtId: null,
    formId: null,
    submitedValues: [],
    isLoadLast: null,
    lastOrderId: null,
    isShowMenu: false,
    isShowForm: false,
    notify_txt: '',
    isShowPaymentButton: false,
    isShowViewButton: true
  },
  _onLoad: function (options) {
    console.log('options ------------------')
    console.log(options)
    this.setData({
      actvtId: options.actvtId,
      formId: options.formid
    })
    if (options.isLoadLast) {
      this.setData({
        isLoadLast: options.isLoadLast
      })
    }
    this.getSignupForm(options.formid)
  },
  onShow: function () {
    let locale = wx.getStorageSync('locale')
    if (this.data.locale != locale) {
      this.getLanguage()
    }
  },

  getActivity: async function () {
    let result = null
    try {
      result = await apiGetActivity(this.data.actvtId)
    } catch (e) {
      console.error(e)
    }

    if (!result) {
      this.showToast('fail_to_get_activity')
      return
    }
    if (!result.status) {
      this.showToast(result.info)
      return
    }
    this.setData({
      activity: result.data
    })
    wx.setStorageSync('signupActivity', JSON.stringify(result.data))
  },
  getSignupForm: async function (formid) {
    this.showLoading({})
    await this.getActivity()
    try {
      if (this.data.settings.bridge_addr) {
        await apiGetBridgeInfo()
      } else {
        await apiSearchThirdAccessCfg()
      }

      let result = await apiSearchForm(formid)
      if (!result.status) {
        this.showToast(`${result.info}:${formid}`)
        this.hideLoading()
        return
      }
      console.log('languageType:', result.data.languageType)
      if (result.data.languageType != '1') {
        this.setData({
          'pageLocale': 'en-US'
        })
      } else {
        this.setData({
          'pageLocale': 'zh-CN'
        })
      }
      this.changePageLanguage(this.data.pageLocale)

      let currentUrl = this.getCurrentPath()
      let sso_redirect = `${this.data.settings.server_addr}/events/sso_redirect.html?next_url=${encodeURIComponent(currentUrl)}`
      console.log('sso_redirect:', sso_redirect)
      console.log(result.data.formView.limitAccessThirdAccessCfgIds)
      if (result.data.formView.limitAccessThirdAccessCfgIds && result.data.formView.limitAccessThirdAccessCfgIds.length !== 0) {
        let tUserRes = await apiGetCurrThirdUserInfo()
        console.log('tUserRes:', tUserRes)
        if (!tUserRes.status) {
          this.showToast(tUserRes.info)
          this.hideLoading()
          return
        }

        if (!tUserRes.returnData.thirdUserInfo.internalUnionUid) {

          let authUrlRes = await apiGetThirdUserAuthUrlWithSessionInfo(encodeURIComponent(sso_redirect))
          console.log('authUrlRes')
          console.log(authUrlRes)
          if (!authUrlRes.status) {
            this.showToast(authUrlRes.message)
            this.hideLoading()
            return
          } else if (authUrlRes.returnData.url) {
            console.log('will go authUrlRes.returnData.url:', authUrlRes.returnData.url)
            wx.navigateTo({
              url: `/pages/redirect_page/redirect_page?next_url=${encodeURIComponent(authUrlRes.returnData.url)}`,
            })
            this.hideLoading()
            return
          } else {
            this.showToast('no_auth_url')
            this.hideLoading()
            return
          }
        }
      }

      let cpnts = result.data.formView.cpnts
      if (this.data.submitedValues && this.data.submitedValues.length !== 0) {
        for (let i of cpnts) {
          for (let j of this.data.submitedValues) {
            if (i['cpntId'] == j['cpntId']) {
              if (!i['initValue'] || i['initValue'].length == 0) {
                i['initValue'] = [j]
              } else {
                i['initValue'].push(j)
              }
            }
          }
        }
      }
      let style = this.getColors(result.data.formView.style)
      this.setData({
        formObj: result.data,
        style: style
      })

      wx.setStorageSync('signupFormData', JSON.stringify(result.data))
      if (this.data.formObj.formName) {
        wx.setNavigationBarTitle({
          title: this.data.formObj.formName
        })
      }
    } catch (e) {
      console.error(e)
    }

    if (this.data.isLoadLast) {
      await this.getUserSubmitData(formid)
    } else {
      this.setData({
        isShowForm: true,
        isShowMenu: false
      })
    }

    this.hideLoading()
  },
  triggerSubmitForm: async function (e) {
    if (e.detail.actionType == 'AF_FORM_SUBMIT') {
      let result = await this.submitSignupForm(e.detail.formData, e.detail.withNotify)
    } else if (e.detail.actionType == 'AF_FORM_ATT_UPLOAD_SUCCESS') {
      this.showToast(this.data.language.base.upload_success)
    } else if (e.detail.actionType == 'AF_FORM_ATT_UPLOAD_FAIL') {
      this.showToast(this.data.language.base.upload_fail)
    } else if (e.detail.actionType == 'AF_FORM_VALIDATE_ERR') {
      this.showToast(e.detail.message)
    }
  },
  submitSignupForm: async function (formData, withNotify) {
    let that = this
    let formId = this.data.formObj.formId

    // if (this.data.lastOrderId) {
    //   this.showDialog({
    //     resetOnClose: true,
    //     closable: true,
    //     title: this.data.language.payment_info,
    //     content: `${this.data.language.order_no}:${this.data.lastOrderId}`,
    //     onConfirm: (e) => {
    //       this.getPaymentArgs(this.data.lastOrderId)
    //     },
    //     onCancel(e) {},
    //   }, true)
    //   return
    // }

    let dataIsRefill = 1
    // if (this.data.lastOrderId) {
    //   dataIsRefill = 2
    // }
    console.log('----------------- submitSignupForm -----------------')
    console.log(formData)
    let params = {
      formId: formId,
      actvtId: this.data.actvtId,
      formData: {
        cpntDatas: formData
      },
      dataIsRefill: dataIsRefill
    }
    this.showLoading({})
    let result = await apiSubmitFormData(params)
    this.hideLoading()
    if (result.status) {
      if (this.data.formObj.formView.submitText) {
        wx.setStorage({
          key: 'success_submit_msg',
          data: this.data.formObj.formView.submitText,
        })
      }
      if (!result.returnData.orderId) {
        if (withNotify) {
          let sendMsgResult = await apiSendWxspSubscribeMsg({
            formDataRowId: result.returnData.formDataRowId,
            formId: this.data.formId,
            msgType: "formSubmitMsg"
          })
          if (!sendMsgResult.status) {
            this.showToast(sendMsgResult.info)
          }
        }

        if (this.data.formObj.formView.submitRedirect) {
          wx.navigateTo({
            url: `/pages/redirect_page/redirect_page?next_url=${this.data.formObj.formView.submitRedirect}`,
          })
        } else {
          wx.navigateTo({
            url: `/pages/signup_success/signup_success?formId=${this.data.formObj.formId}&actvtId=${this.data.activity.actvtId}`,
          })
        }
      } else {
        let formId = this.data.formObj.formId
        this.showDialog({
          resetOnClose: true,
          closable: true,
          title: this.data.language.payment_info,
          content: `${this.data.language.order_no}:${result.returnData.orderId}`,
          onConfirm: (e) => {
            this.getPaymentArgs(result.returnData.orderId)
          },
          onCancel(e) {},
        }, true)
      }
    } else {
      this.showToast(result.info)
    }
  },

  getPaymentArgs: async function (orderId, withNotify) {
    let result = await apiWxSpStartPayThroughBridge({
      payCase: 30,
      orderId: orderId
    })
    console.log('Payment arguments:', result)
    if (!result.status) {
      this.showToast(result.info)
      return
    }
    try {
      await asyncPayment(result.returnData.jsPayParams)

      wx.showToast({
        title: this.data.language.payment_success,
        icon: 'success',
        duration: this.data.settings.shortToastSec
      })
      if (withNotify) {
        let sendMsgResult = await apiSendWxspSubscribeMsg({
          formDataRowId: result.returnData.formDataRowId,
          formId: this.data.formId,
          msgType: "formSubmitMsg"
        })
        if (!sendMsgResult.status) {
          this.showToast(sendMsgResult.info)
        }
      }
      console.log('result.returnData.formDataRowId:', this.data.formObj.formView)
      setTimeout(() => {
        if (this.data.formObj.formView.submitRedirect) {
          wx.navigateTo({
            url: `/pages/redirect_page/redirect_page?next_url=${this.data.formObj.formView.submitRedirect}`,
          })
        } else {
          wx.navigateTo({
            url: `/pages/signup_success/signup_success?formId=${this.data.formObj.formId}&actvtId=${this.data.activity.actvtId}`,
          })
        }

      }, this.data.settings.shortToastSec)
    } catch (e) {
      console.error(e)
      this.showToast(`${this.data.language.payment_fail}:${e.errMsg}`)
    }
  },
  getUserinfo: async function () {
    let result = await apiGetCurrThirdUserInfo()
    console.log('getUserinfo:', result)
    if (!result.status) {
      this.showToast(result.info)
      return
    }
  },
  backToForm: function () {
    this.setData({
      showForm: true
    })
  },
  getUserSubmitData: async function (formid) {
    let result = await apiSearchUserLastSubmitForm({
      formId: formid
    })
    if (!result.status) {
      if (!result.errorCode && result.info != "找不到相应数据。") {
        this.showErrMsg(result.info)
        return
      }

      if (result.info == "找不到相应数据。") {
        this.setData({
          isShowForm: true,
          isShowMenu: false
        })
        return
      }
    }

    console.log('formObj:', this.data.formObj)
    var notify_txt = this.data.language.base.form_submitted_and_reopened.replace('##submit_time##', result.returnData.formData.displayCreateTime)

    if (this.data.formObj.formView.endReplyNum && this.data.formObj.replyNum >= this.data.formObj.formView.endReplyNum) {
      notify_txt = this.data.language.base.form_reach_collection_limit
    }

    let now = moment()
    if (this.data.formObj.formView.endTime) {
      let endTime = moment(this.data.formObj.formView.endTime)
      if (now > endTime) {
        notify_txt = this.data.language.base.form_collection_stoped
      }
    }

    if (this.data.formObj.formView.startTime) {
      let startTime = moment(this.data.formObj.formView.startTime)
      if (now < startTime) {
        notify_txt = `${this.data.language.base.form_collection_not_start}: ${this.data.formObj.formView.startTime}`
      }
    }

    this.setData({
      submitedValues: result.returnData.formData.values,
      isShowForm: false,
      isShowMenu: true,
      notify_txt: notify_txt
    })
    if (result.returnData.formData.buyOrder && result.returnData.formData.buyOrder.orderStatus == 5) {
      this.setData({
        lastOrderId: result.returnData.formData.buyOrder.orderId,
        isShowPaymentButton: true,
        isShowViewButton: false
      })
    } else {

      this.setData({
        lastOrderId: null,
        isShowPaymentButton: false,
        isShowViewButton: true
      })
    }
  },
  jumpSpecificPage() {
    wx.navigateTo({
      url: `/pages/webpage/webpage?webview_url=${encodeURIComponent(this.data.formObj.formView.submitRedirect)}`
    })
  },
  jumpOnlinePage() {
    console.log('activity:', this.data.activity)
    wx.navigateTo({
      url: `/pages/webpage/webpage?webview_url=${encodeURIComponent(this.data.activity.onlineActvtUrl)}`
    })
  },
  jumpFeedbackPage() {
    wx.navigateTo({
      url: `/pages/form_feedback/form_feedback?formDataRowId=${this.data.formObj}&formid=${this.data.formObj.formId}`
    })
  },

  jumpTicketPage(e) {
    wx.navigateTo({
      url: `/pages/ticket/ticket?title=${this.data.formObj.formView.formTitle}&actvtId=${this.data.activity.actvtId}&formid=${this.data.formObj.formId}&isLoadLast=1`
    })
  },
  returnToForm() {
    this.setData({
      isShowMenu: false,
      isShowForm: true
    })
  },
  startPayOrder(e) {
    console.log('startPayOrder')
    this.getPaymentArgs(this.data.formObj.formId)
  }
})


Page(PageObject)