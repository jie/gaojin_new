import {
  apiGetPtk,
  apiGetSysDfvs,
  apiSearchActvt,
  apiGetAllActvtGroupInfo,
  apiSearchFormValidDataDate,
  apiSearchUserFormSubmitFootmark,
  apiSearchUserFormData,
  apiGetActivity
} from '../../after_lib/api'
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'
import moment from '../../libs/moment.min.js'
import {
  getToday,
  getTomorrow,
  getCurrWeekDays,
  getCurrMonthDays
} from '../../libs/dateutils'
import PageBehavior from '../../utils/page_behaviors'
import mergePages from '../../libs/objectUtils'

const PageObject = mergePages({}, PageBehavior, {
  data: {
    pageName: 'mine_events',
    title: '',
    tabIndex: 0,
    isShowSearchPopup: false,
    searchItems: [],
    categories: [],
    timeRange: [],
    cities: [],
    groups: [],
    events: [],
    pageData: {},
    showBottomLine: false,
    tabItems: [],
    validateMonths: [],
    eventDatas: [],
    actvtDatas: {},
    //处理标识
    handleFlag: null,
    //验票
    signStatus: null,
    // startTime
    startTime: null,
    endTime: null,
    currentKey: 1,
    isEmpty: false,
    // 是否搜索待支付
    isPay: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  setTopTab: function () {
    this.setData({
      tabItems: [{
        key: '1',
        name: this.data.language.all,
      },
      {
        key: '2',
        name: this.data.language.joined,
      },
      {
        key: '3',
        name: this.data.language.pending,
      } 
      ]
    })
  },
  _getFormData: function (data) {
    let formData = {}
    for (let item of data) {
      if (!formData[item.formId]) {
        formData[item.formId] = [item.formDataRowId]
      } else {
        formData[item.formId].push(item.formDataRowId)
      }
    }
    return formData
  },
  makeMonthArray: function() {
    let today;
    if(this.data.startTime) {
      today = moment(this.data.startTime).add(90, 'days')
    } else {
      today = moment()
    }

    this.setData({
      startTime: today.format('YYYY-MM-DD'),
      endTime: today.add(90, 'days').format('YYYY-MM-DD')
    })
    console.log('startTime:', this.data.startTime)
    console.log('endTime:', this.data.endTime)
  },
  apiSearchFormValidDataDate: async function () {
    this.showLoading({})
    this.setData({
      isEmpty: false
    })
    try {
      let dfvConfig = wx.getStorageSync('dfvConfig')
      let result = await apiSearchFormValidDataDate({
        tokenApiSearchFormValidDataDate: dfvConfig.dfvTokenApiSearchFormValidDataDate
      })
      if (!result.status) {
        this.showToast(result.info)
        return
      }
      this.setData({
        validateMonths: result.returnData.dates
      })

      result = await apiSearchUserFormSubmitFootmark({ perpage: 100, startTime: this.data.startTime, endTime: this.data.endTime })
      if (!result.status) {
        this.showToast(result.info)
        return
      }
      let formRowDatas = result.returnData.datas
      let formatedRowDatas = this._getFormData(formRowDatas)

      let eventDatas = []
      let formRowResult;
      let actResult;
      let curActvtData;

      for (let item of Object.keys(formatedRowDatas)) {
        var qParams = {
          formDataRowIds: formatedRowDatas[item],
          formId: item,
          perpage: 100
        }
        if (this.data.signStatus !== null) {
          qParams.signStatus = this.data.signStatus
        }
        if (this.data.handleFlag !== null) {
          qParams.handleFlag = this.data.handleFlag
        }
        
        formRowResult = await apiSearchUserFormData(qParams)

        if (formRowResult.returnData && formRowResult.returnData.formDatas) {
          for (let i of formRowResult.returnData.formDatas) {
            console.log('*********')
            console.log(i)
            console.log(this.data.isPay)
            if (this.data.isPay) {
              if (!i.buyOrder || i.buyOrder.orderStatus != 5) {
                continue
              }
            }


            if (i.actvtId) {
              if (!this.data.actvtDatas[i.actvtId]) {
                actResult = await apiGetActivity(i.actvtId)
                if (!actResult.returnData.actvts) {
                  continue
                }
                curActvtData = {
                  actvtId: i.actvtId,
                  formDataRowId: i.formDataRowId,
                  actvtName: actResult.returnData.actvts[0].actvtName,
                  cover: actResult.returnData.actvts[0].actvtView.actvtCover[0],
                  displayParentCityName: actResult.returnData.actvts[0].displayParentCityName,
                  displayCityName: actResult.returnData.actvts[0].displayCityName,
                  actvtAddress: actResult.returnData.actvts[0].actvtAddress,
                  displayCreateTime: actResult.returnData.actvts[0].displayCreateTime,
                  _createTime: moment(actResult.returnData.actvts[0].displayActvtStartTime).format('YYYY-MM-DD HH:mm')
                }
              } else {
                curActvtData = { ...this.data.actvtDatas[i.actvtId] }
              }
              eventDatas.push({
                ...curActvtData,
                formId: item,
                formDataRowId: i.formDataRowId,
                handleFlag: i.handleFlag,
                signStatus: i.signStatus
              })
            }
          }
        }
      }
      this.setData({
        eventDatas: eventDatas
      })
      if(eventDatas.length === 0) {
        this.setData({
          isEmpty: true
        })
      }

      console.log('=======================')
      console.log(this.data.eventDatas)
    } catch (e) {
      console.log(e)
    }
    this.hideLoading()
  },
  _onLoad: function (options) {
    this.makeMonthArray()
    this.getLanguage()
    this.setTopTab()
    this.apiSearchFormValidDataDate()
    if (options.index !== undefined && options.index !== null) {
      this.setData({
        tabIndex: options.index,
        currentKey: parseInt(options.index)+1
      })
      // if (options.index == 1) {
      //   this.setData({
      //     signStatus: 2
      //   })
      // }
        if (options.index == 1) {
        this.setData({
          handleFlag: 1
        })
      }
      if (options.index == 2) {
        this.setData({
          handleFlag: 2
        })
      }
      if (options.index == 3) {
        this.setData({
          signStatus: null,
          handleFlag: null,
          isPay: true
        })
      }
    }
  },
  onReachBottom: async function () {
    if (this.data.showBottomLine) {
      return
    }

    this.setData({
      'pageData.pagenum': this.data.pageData.pagenum + 1
    })
    // this.getEntities(this.data.pageData.pagenum, true)
    this.makeMonthArray()
    await this.apiSearchFormValidDataDate()
  },

  onShow: function () {
    let locale = wx.getStorageSync('locale')
    if (this.data.locale != locale) {
      this.getLanguage()
      this.setTopTab()
    }
  },

  onShareAppMessage: function () {
    return {
      path: '/pages/home/home'
    }
  },
  onTapEvent: function (e) {
    console.log(e)
  },
  preventD: function () {

  },
  triggerTabChange: function (e) {
    this.setData({
      currentKey:e.detail.key
    })
    switch (e.detail.key) {
      case '1':
        this.setData({
          signStatus: null,
          handleFlag: null,
          isPay: false
        })
        break
      // case '2':
      //   this.setData({
      //     signStatus: 2,
      //     handleFlag: null,
      //     isPay: false
      //   })
      //   break
      case '2':
        this.setData({
          signStatus: null,
          handleFlag: 1,
          isPay: false
        })
        break
      case '3':
        this.setData({
          signStatus: null,
          handleFlag: 2,
          isPay: false
        })
        break
      case '4':
        this.setData({
          signStatus: null,
          handleFlag: null,
          eventDatas: [],
          isEmpty: false,
          isPay: true
        })
        break
    }
    console.log('isPay:', this.data.isPay)
    this.apiSearchFormValidDataDate()
  },
  goTicket: function (e) {
    wx.navigateTo({
      url: `/pages/ticket/ticket?title=${e.target.dataset.title}&actvtId=${e.target.dataset.actvtId}&formid=${e.target.dataset.formid}&isLoadLast=1`
    })
  },
  getMyEvents: async function () {


  },
  goEventsPage: function() {
    this.goToURL('/pages/events/events')
  }
})


Page(PageObject)
