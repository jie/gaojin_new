import {
  apiGetPtk,
  apiGetSysDfvs,
  apiSearchActvt,
  apiGetThirdAccessWxSpUserLoginInfo,
  apiSearchCity,
  apiSearchCityByRegion,
  apiGetAllActvtGroupInfo
} from '../../after_lib/api'
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'
import moment from '../../libs/moment.min.js'
import {
  getToday,
  getTomorrow,
  getCurrWeekDays,
  getCurrWeekendDays,
  getCurrMonthDays,
  getCurrYearDays
} from '../../libs/dateutils'

import PageBehavior from '../../utils/page_behaviors'
import mergePages from '../../libs/objectUtils'

const PageObject = mergePages({}, PageBehavior, {
  data: {
    pageName: 'events',
    title: '',
    isShowSearchPopup: false,
    searchItems: [],
    categories: [],
    timeRange: [],
    cities: [],
    groups: [],
    events: [],
    pageData: {},
    showBottomLine: false,
    cityIndex: null,
    timeIndex: null,
    cateIndex: null,
    curFilter: null,
    colIndex: null,
    radioCase: 'onlyNotExpired',
    // filterbar
    filterBarItems: [
      [],
      [],
      []
    ],
    topItems: [],
    allItems: [],
    curveBgPosition: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  _onLoad: function (options) {
    this.setData({
      curveBgPosition: parseInt(this.data.systemInfo.screenWidth / 2)
    })
    this.getLanguage()
    this.setTabLocale()
    this.updateSearchBar()
    this.getCities()
    this.getGroups(() => {
      // 支持url直接打开分类
      if (options.groupId) {
        for (let i = 0; i < this.data.filterBarItems[0].length; i++) {
          if (this.data.filterBarItems[0][i].value == options.groupId) {
            this.setData({
              cateIndex: i
            })
            this.data.topItems[0].label = this.data.filterBarItems[0][i].label
            this.setData({
              topItems: this.data.topItems
            })
            break
          }
        }
      }
      this.getEntities()
    })
  },
  getGroups: async function (cb) {
    let result = await apiGetAllActvtGroupInfo()
    if (!result.status) {
      this.showToast(result.info)
      return
    }
    let groups = []
    if (this.data.settings.enviroment != 'ceibs') {
      for (let item of result.returnData.groups) {
        if (this.data.locale == 'zh-CN') {
          groups.push({
            "label": item.groupName,
            "value": item.groupId
          })
        } else {
          groups.push({
            "label": item.groupEnName,
            "value": item.groupId
          })
        }
      }
    } else {
      groups = [{
          label: this.data.language.offline_event,
          value: '2'
        },
        {
          label: this.data.language.online_event,
          value: '3'
        }
      ]
    }

    if (this.data.settings.enviroment == 'ceibs') {
      this.data.filterBarItems[2] = groups
    } else {
      this.data.filterBarItems[0] = groups
    }

    this.setData({
      filterBarItems: this.data.filterBarItems
    })
    if (cb) {
      cb()
    }
  },
  getCities: async function () {
    let cities = []
    if (this.data.settings.enviroment != 'pro_kedge' && this.data.settings.enviroment != 'ceibs') {
      let result = await apiSearchCityByRegion({
        parentIds: [1]
      })
      if (!result.status) {
        this.showToast(result.info)
        return
      }
      for (let item of result.returnData.datas) {
        if (this.data.locale == 'zh-CN') {
          cities.push({
            "label": item.cityName,
            "value": item.cityId
          })
        } else {
          cities.push({
            "label": item.cityEnName,
            "value": item.cityId
          })
        }
      }
    } else {

      if (this.data.locale == 'en-US') {
        cities = [{
            "value": "2",
            "label": "BeiJing"
          },
          {
            "value": "25",
            "label": "ShangHai"
          },
          {
            "value": "6",
            "label": "GuangZhou",
          },
          {
            value: null,
            label: 'Other'
          }
        ]
      } else {
        cities = [{
            "value": "25",
            "label": "上海"
          },
          {
            "value": "2",
            "label": "北京"
          },
          {
            "value": "6",
            "label": "广州",
          },
          {
            value: null,
            label: '其他'
          }
        ]

      }
    }

    if (this.data.settings.enviroment == 'ceibs') {
      this.data.filterBarItems[0] = cities
    } else {
      this.data.filterBarItems[2] = cities
    }

    this.setData({
      filterBarItems: this.data.filterBarItems
    })

  },

  getEntities: function (pageNum = 1, isAppend = false, isRefresh = false) {
    let pageArgs = {
      pagenum: pageNum,
      sortCase: "18",
    }

    if (isRefresh) {
      pageArgs.pagenum = 1
    } else {
      // radioCase: this.data.radioCase
    }


    if (this.data.locale === 'zh-CN') {
      pageArgs.languageTypes = ['1']
    } else if (this.data.locale === 'en-US') {
      pageArgs.languageTypes = ['2']
    }

    if (this.data.timeIndex !== null) {
      if (this.data.filterBarItems[1][this.data.timeIndex]['value'][0] !== null) {
        pageArgs['actvtStartTime'] = this.data.filterBarItems[1][this.data.timeIndex]['value'][0]
      }
      if (this.data.filterBarItems[1][this.data.timeIndex]['value'][1] !== null) {
        pageArgs['actvtEndTime'] = this.data.filterBarItems[1][this.data.timeIndex]['value'][1]
      }

    } else {
      delete pageArgs.actvtStartTime
      delete pageArgs.actvtEndTime
    }

    if (this.data.settings.enviroment != 'ceibs') {

      if (this.data.cateIndex !== null) {
        pageArgs['actvtGroupCdt'] = {
          actvtGroupCdtType: 2,
          actvtGroupIds: [this.data.filterBarItems[0][this.data.cateIndex]['value']]
        }
      } else {
        delete pageArgs.actvtGroupCdt
      }
  
      if (this.data.cityIndex !== null) {
        if (this.data.filterBarItems[2][this.data.cityIndex]['value'] === null) {
          pageArgs['actvtNotLocations'] = ["2", "25", "77"]
        } else {
          pageArgs['actvtLocations'] = [this.data.filterBarItems[2][this.data.cityIndex]['value']]
        }

      } else {
        delete pageArgs.actvtLocations
      }

    } else {

      if (this.data.cateIndex !== null) {
        pageArgs['onlineType'] = [this.data.filterBarItems[2][this.data.cateIndex]['value']]
      } else {
        delete pageArgs.onlineType
      }
      if (this.data.cityIndex !== null) {
        if (this.data.filterBarItems[0][this.data.cityIndex]['value'] === null) {
          pageArgs['actvtNotLocations'] = ["2", "25", "77"]
        } else {
          pageArgs['actvtLocations'] = [this.data.filterBarItems[0][this.data.cityIndex]['value']]
        }

      } else {
        delete pageArgs.actvtLocations
      }

    }


    console.log('query:', pageArgs)

    wx.showLoading({
      title: this.data.language.base.loading,
    });

    apiSearchActvt(pageArgs).then((res) => {
      wx.hideLoading();
      if (!res.status) {
        this.showToast(res.info)
        return
      }

      wx.stopPullDownRefresh();
      let showBottomLine = false
      if (pageArgs.pagenum >= res.returnData.pagetotal) {
        showBottomLine = true
      }

      let events;
      let _events = []

      // if (!isRefresh) {
      //   if (!res.returnData.actvts || res.returnData.actvts.length == 0) {
      //     this.setData({
      //       radioCase: 'onlyExpired'
      //     })
      //   }
      // }

      for (let item of res.returnData.actvts) {
        if (item.viewNum) {
          item.viewNum = parseInt(item.viewNum) + 200
        }
        if (this.data.locale == 'zh-CN') {
          _events.push({
            ...item,
            cityName: item.displayCityName,
            parentCityName: item.displayParentCityName,
            isExpired: moment().isAfter(moment(item.displayActvtEndTime)),
            _createTime: moment(item.displayActvtStartTime).format('YYYY-MM-DD HH:mm')
          })
        } else {
          _events.push({
            ...item,
            cityName: item.displayCityEnName,
            parentCityName: item.displayParentCityEnName,
            isExpired: moment().isAfter(moment(item.displayActvtEndTime)),
            _createTime: moment(item.displayActvtStartTime).format('YYYY-MM-DD HH:mm')
          })
        }
      }
      if (!isRefresh) {
        if (isAppend) {
          events = [...this.data.events, ..._events]
        } else {
          events = _events
        }

        this.setData({
          events: events,
          pageData: {
            pagenum: res.returnData.pagenum,
            pagetotal: res.returnData.pagetotal,
            perpage: res.returnData.perpage,
            total: res.returnData.total
          },
          showBottomLine: showBottomLine
        })
      } else {
        let newEvents = []
        let oldEvents = []
        for (let item of this.data.events) {
          oldEvents.push(item.actvtId)
        }
        for (let item of events) {
          if (!oldEvents.includes(item.actvtId)) {
            newEvents.push(item)
          }
        }
        this.setData({
          events: [...newEvents, ...this.data.events],
          showBottomLine: false
        })
      }
    }, () => {
      wx.hideLoading();
    })
  },
  onReachBottom: function () {
    if (this.data.showBottomLine) {
      return
    }

    this.setData({
      'pageData.pagenum': this.data.pageData.pagenum + 1
    })
    this.getEntities(this.data.pageData.pagenum, true, false)
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
    let locale = wx.getStorageSync('locale')
    if (this.data.locale != locale) {
      this.getLanguage()
      this.setTabLocale()
      this.updateSearchBar()
      this.getGroups()
      this.getCities()
      this.getEntities()
    }
  },

  onTapSearchHeader: function () {
    this.setData({
      isShowSearchPopup: false,
      searchItems: [],
      curFilter: null
    })
  },
  onTapSearchbarInner: function () {
    //
  },
  // openCategoryPopup: function () {
  //   if (this.data.isShowSearchPopup === true && this.data.curFilter == 'cate') {
  //     this.setData({
  //       isShowSearchPopup: false,
  //       searchItems: [],
  //       curFilter: null,
  //       cateIndex: 0
  //     })
  //   } else {
  //     this.setData({
  //       isShowSearchPopup: true,
  //       searchItems: this.data.groups,
  //       curFilter: "cate"
  //     })
  //   }
  // },
  // openTimePopup: function () {
  //   if (this.data.isShowSearchPopup === true && this.data.curFilter == 'time') {
  //     this.setData({
  //       isShowSearchPopup: false,
  //       searchItems: [],
  //       curFilter: null,
  //       timeIndex: 0
  //     })
  //   } else {
  //     this.setData({
  //       isShowSearchPopup: true,
  //       searchItems: this.data.timeRange,
  //       curFilter: "time"
  //     })
  //   }
  // },
  // openCityPopup: function () {
  //   if (this.data.isShowSearchPopup === true && this.data.curFilter == 'city') {
  //     this.setData({
  //       isShowSearchPopup: false,
  //       searchItems: [],
  //       curFilter: null,
  //       cityIndex: 0
  //     })
  //   } else {
  //     this.setData({
  //       isShowSearchPopup: true,
  //       searchItems: this.data.cities,
  //       curFilter: "city"
  //     })
  //   }
  // },
  goTesting() {
    wx.navigateTo({
      url: '/pages/testing/testing',
    })
  },
  setEventFilter: function (e) {
    if (this.data.curFilter == 'time') {
      this.setData({
        timeIndex: e.target.dataset.index,
        isShowSearchPopup: false
      })
    } else if (this.data.curFilter == 'cate') {
      this.setData({
        cateIndex: e.target.dataset.index,
        isShowSearchPopup: false
      })
    } else if (this.data.curFilter == 'city') {
      this.setData({
        cityIndex: e.target.dataset.index,
        isShowSearchPopup: false
      })
    }

    this.getEntities()
  },
  onTapEvent: function (e) {
    console.log(e)
  },
  preventD: function () {

  },
  updateSearchBar: function () {
    let now = moment().format('YYYY-MM-DD 00:00:00')
    let today = getToday()
    let tomorrow = getTomorrow()
    let week = getCurrWeekDays()
    let month = getCurrMonthDays()
    let year = getCurrYearDays()
    today[0] = now
    tomorrow[0] = now
    week[0] = now
    month[0] = now
    let timeRange = [{
        "label": this.data.language.today,
        "value": today
      },
      {
        "label": this.data.language.this_week,
        "value": week
      },
      {
        "label": this.data.language.this_month,
        "value": month
      },
      {
        "label": this.data.language.this_year,
        "value": year
      }
    ]

    let allItems = [{
        label: this.data.language.all_groups,
        value: 0
      },
      {
        label: this.data.language.all_times,
        value: 1
      },
      {
        label: this.data.language.all_cities,
        value: 2
      }
    ]
    let topItems = [{
        label: this.data.language.all_groups,
        value: 0
      },
      {
        label: this.data.language.all_times,
        value: 1
      },
      {
        label: this.data.language.all_cities,
        value: 2
      }
    ]

    if (this.data.settings.enviroment === 'ceibs') {
      allItems = [{
          label: this.data.language.all_cities_ceibs,
          value: 2
        },
        {
          label: this.data.language.all_times_ceibs,
          value: 1
        },
        {
          label: this.data.language.all_types_ceibs,
          value: 0
        },

      ]
      topItems = [{
          label: this.data.language.all_cities_ceibs,
          value: 2
        },
        {
          label: this.data.language.all_times_ceibs,
          value: 1
        },
        {
          label: this.data.language.all_types_ceibs,
          value: 0
        },

      ]
    }

    this.data.filterBarItems[1] = timeRange
    this.setData({
      filterBarItems: this.data.filterBarItems,
      allItems: allItems,
      topItems: topItems
    })
  },
  onPullDownRefresh: function () {
    this.getEntities()
    wx.stopPullDownRefresh()
  },
  onFilterTabChanged: function (e) {
    this.setData({
      colIndex: e.detail.col
    })
  },
  onFilterAllItemChanged: function (e) {
    let label = this.data.allItems[e.detail.index].label
    if(this.data.settings.enviroment != 'ceibs') {
      if (e.detail.index == 0) {
        this.setData({
          cateIndex: null
        })
      } else if (e.detail.index == 1) {
        this.setData({
          timeIndex: null
        })
      } else if (e.detail.index == 2) {
        this.setData({
          cityIndex: null
        })
      }
    } else {
      if (e.detail.index == 2) {
        this.setData({
          cateIndex: null
        })
      } else if (e.detail.index == 1) {
        this.setData({
          timeIndex: null
        })
      } else if (e.detail.index == 0) {
        this.setData({
          cityIndex: null
        })
      }
    }


    this.data.topItems[e.detail.index].label = label
    this.setData({
      topItems: this.data.topItems
    })
    this.getEntities()
  },
  onFilterItemChanged: function (e) {
    let label = this.data.filterBarItems[e.detail.col][e.detail.index].label
    if (this.data.settings.enviroment == 'ceibs') {
      if (e.detail.col == 2) {
        this.setData({
          cateIndex: e.detail.index,
          colIndex: e.detail.col
        })

      } else if (e.detail.col == 1) {
        this.setData({
          timeIndex: e.detail.index,
          colIndex: e.detail.col
        })
      } else if (e.detail.col == 0) {
        this.setData({
          cityIndex: e.detail.index,
          colIndex: e.detail.col
        })
      }
    } else {
      if (e.detail.col == 0) {
        this.setData({
          cateIndex: e.detail.index,
          colIndex: e.detail.col
        })

      } else if (e.detail.col == 1) {
        this.setData({
          timeIndex: e.detail.index,
          colIndex: e.detail.col
        })
      } else if (e.detail.col == 2) {
        this.setData({
          cityIndex: e.detail.index,
          colIndex: e.detail.col
        })
      }
    }

    this.data.topItems[e.detail.col].label = label
    this.setData({
      topItems: this.data.topItems
    })
    this.getEntities()
  }
})


export default PageObject