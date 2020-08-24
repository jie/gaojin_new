import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'
import { apiGetAllArtcGroupInfo, apiSearchArtc } from '../../after_lib/api'
import moment from '../../libs/moment.min.js'
import PageBehavior from '../../utils/page_behaviors'
import mergePages from '../../libs/objectUtils'

function compareByIntKey(propName) {
  return function (obj1, obj2) {
    if (parseInt(obj1[propName]) > parseInt(obj2[propName])) {
      return -1
    } else if (parseInt(obj1[propName]) === parseInt(obj2[propName])) {
      return 0
    } else {
      return 1
    }
  }
}

function sumArray(arr) {
  let s = 0;
  for (let i of arr) {
    s += i
  }
  return s
}

const PageObject = mergePages({}, PageBehavior, {

  data: {
    pageName: 'news',
    pagenum: 1,
    perpage: 20,
    groupId: null,
    categories: [],
    entities: [],
    currentCategory: 0,
    tabBorderX: 0,
    tabBorderWidth: 0,
    categoriesWidth: [],
    categoriesPosX: [],
    scrollLeft: 0,
    distance: 0,
    showBottomLine: false
  },
  getTabBorderWidth: function () {
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    let posArray = []
    let widthArray = []
    query.selectAll('.scroll-view-item').boundingClientRect(function (rects) {
      rects.forEach(function (rect) {
        widthArray.push(rect.width)
        posArray.push(rect.left)

      })
      that.setData({
        tabBorderWidth: rects[0].width,
        tabBorderX: rects[0].left
      })
    }).exec();
    this.setData({
      categoriesPosX: posArray,
      categoriesWidth: widthArray
    })
  },
  getCategories: async function (groupId) {
    let result = await apiGetAllArtcGroupInfo()
    if (result.status) {
      let data = result.returnData.groups
      this.setData({
        categories: [
        {
            groupId: null,
            groupName: '全部',
            groupEnName: 'All'
        },
        ...data
        ]
    })

      this.getTabBorderWidth()
      if (groupId !== undefined) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].groupId == groupId) {
            this.setData({
              currentCategory: i + 1
            })
            console.log('this.data.currentCategory:', this.data.currentCategory)
            this.apiSearchArtc(this.data.currentCategory)
            return
          }
        }
      }

      this.apiSearchArtc()
    }
  },
  onChangeScrollTab: function (e) {
    let index = e.target.dataset.index
    let posX = []
    for (let i = 0; i < this.data.categoriesWidth.length; i++) {
      posX.push(sumArray(this.data.categoriesWidth.slice(0, i)))
    }
    let scrollWidth = sumArray(this.data.categoriesWidth.slice(0, index))
    let maxMovX = sumArray(this.data.categoriesWidth) - this.data.systemInfo.screenWidth
    let targetWidth = this.data.categoriesWidth[index]
    let centerX = this.data.systemInfo.screenWidth / 2
    let movX = posX[index] + targetWidth / 2 - centerX
    console.log('movX:', movX)
    let leftX;
    if (movX > 0) {
      if (movX > maxMovX) {
        leftX = maxMovX
      } else {
        leftX = movX
      }
    } else {
      leftX = 0
    }

    if(leftX < 0) {
      leftX = 0
    }

    let distance = this.data.scrollLeft - leftX
    this.setData({
      scrollLeft: leftX,
      distance: distance,
      showBottomLine: false
    })

    this.apiSearchArtc(index)
  },
  onTabScroll: function (e) {
    console.log(e)
    let categoriesPosX = []
    for (let item of this.data.categoriesPosX) {
      categoriesPosX.push(
        item + e.detail.deltaX
      )
    }
    this.setData({
      scrollLeft: e.detail.scrollLeft,
      categoriesPosX: categoriesPosX
    })
    this.setData({
      tabBorderX: this.data.categoriesPosX[this.data.currentCategory]
    })
  },
  apiSearchArtc: async function (index, pagenum = 1, isAppend = false, isRefresh = false) {
    wx.showLoading({
      title: this.data.language.base.loading,
    });

    try {
      let data = {
        pagenum: pagenum || this.data.pagenum,
        perpage: this.data.perpage,
        sortCase: 10
      }

      if (index !== undefined && this.data.categories[index] && this.data.categories[index].groupId) {
        data.artcGroupCdt = {
          artcGroupCdtType: 2,
          artcGroupIds: [this.data.categories[index].groupId]
        }
      }
      let result = await apiSearchArtc(data)
      if (!result.status && result.code !== '0') {
        wx.hideLoading()
        this.showToast(result.info)
        return
      }



      if (result.code == '0') {
        wx.hideLoading()
        result.returnData = {
          artcs: [],
          pagenum: 1,
          perpage: 20,
        }
      }

      for (let item of result.returnData.artcs) {
        item._createAt = item.displayPubTime ? moment(item.displayPubTime).format('YYYY-MM-DD') : ''
        this.data.categories.map((cat) => {
          if(cat.groupId == item.groupId) {
            item.groupInfo = cat
          }
        })
      }


      let entities = []
      if (!isRefresh) {
        if (isAppend) {
          entities = [...this.data.entities, ...result.returnData.artcs]
        } else {
          entities = result.returnData.artcs
        }

        if (index === undefined || index === 0) {
          let _entities = []
          for (let item of entities) {
            if (item.isTop === '1') {
              _entities.push(item)
            }
          }
          this.setData({
            entities: entities,
            pagenum: result.returnData.pagenum,
            perpage: result.returnData.perpage
          })
        } else {
          this.setData({
            entities: entities,
            pagenum: result.returnData.pagenum,
            perpage: result.returnData.perpage
          })
        }

      } else {
        entities = result.returnData.artcs
        if (index === undefined || index === 0) {
          let _entities = []
          for (let item of entities) {
            if (item.isTop === '1') {
              _entities.push(item)
            }
          }
          this.setData({
            entities: entities,
            pagenum: 1,
            perpage: result.returnData.perpage
          })
        } else {
          this.setData({
            entities: entities,
            pagenum: 1,
            perpage: result.returnData.perpage
          })
        }
      }
      if (index !== undefined) {
        this.setData({
            tabBorderWidth: this.data.categoriesWidth[index],
            tabBorderX: this.data.categoriesPosX[index] + this.data.distance,
            currentCategory: index
        })
      }

      if (result.returnData.pagetotal === result.returnData.pagenum) {
        this.setData({
          showBottomLine: true
        })
      }

    } catch (e) {
      console.log(e)
    }
    if (isRefresh) {
      wx.stopPullDownRefresh()
    }
    wx.hideLoading()

  },
  goNewsDetail: function (e) {
    console.log(e)
    let entity = e.currentTarget.dataset.entity
    if (!entity) {
      return
    }

    console.log('entity:', entity)

    if (entity.outsideLink) {
      wx.navigateTo({
        url: `/pages/outside/outside?webview_url=${entity.outsideLink}`,
      })
    } else {
      wx.navigateTo({
        url: `/pages/news_detail/news_detail?artcId=${entity.artcId}`,
      })
    }

  },
  _onLoad: function (options) {
    console.log('======= options ========')
    console.log(options)
    this.getCategories(options.groupId)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getTabBorderWidth()
  },

  onPullDownRefresh: function () {
    this.setData({
      showBottomLine: false
    })
    this.apiSearchArtc(this.data.currentCategory, 1, false, true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.showBottomLine) {
      return
    }
    let pagenum = parseInt(this.data.pagenum) + 1
    console.log('pagenum:', pagenum)
    this.apiSearchArtc(this.data.currentCategory, pagenum, true, false)
  }
})

Page(PageObject)