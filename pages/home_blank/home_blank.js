import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'
import {
  getSchoolInfoList
} from '../../campus_lib/api'
import {
  apiGetAllArtcGroupInfo,
  apiSearchArtc
} from '../../after_lib/api'
import moment from '../../libs/moment.min.js'
import PageBehavior from '../../utils/page_behaviors'
import mergePages from '../../libs/objectUtils'
var url1 = 'https://mba-events.saif.sjtu.edu.cn/saif/h5/2020/index.html';
var url2 = 'https://mba.saif.sjtu.edu.cn/admission';
const PageObject = mergePages({}, PageBehavior, {

  data: {
    pageName: 'home',
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
    swipterUrls: [{
        'imgUrl': 'http://icci.cn/upload/20200409/7ab4d6f88cc6df8b5738b279df824c7f.jpg'
      },
      {
        'imgUrl': 'http://icci.cn/upload/20200409/7ab4d6f88cc6df8b5738b279df824c7f.jpg'
      }
    ],
    newsData: [],
    total: 0
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

  getGroups: async function (cb) {
    let result = await apiGetAllArtcGroupInfo()
    if (result.status) {
      this.setData({
        groups: result.returnData.groups
      })
      if (cb) {
        cb()
      }

    }
  },
  getSchoolInfoList: async function (pagenum = 1, isAppend = false, isRefresh = false) {
    wx.showLoading({
      title: this.data.language.base.loading,
    });

    try {
      this.data.locale = wx.getStorageSync('locale');

      let data = {
        pagenum: pagenum || this.data.pagenum,
        perpage: this.data.perpage,
        sortCase: 10
      }
      this.setData({
        pagenum: pagenum
      });
      console.log("this Language:", this.data.locale)

      data.groupId = ''
      let result = await apiSearchArtc(data)
      console.log('============================= response get success =============================')

      if (!result.status) {
        wx.hideLoading()
        this.showToast(result.info)
        return
      }

      let newsData = [];
      if (result.status) {

        for (let item of result.returnData.artcs) {
          item._createAt = item.displayPubTime ? moment(item.displayPubTime).format('YYYY-MM-DD') : ''
          this.data.groups.map((cat) => {
            if (cat.groupId == item.groupId) {
              item.groupInfo = cat
            }
          })

        }

        if (isRefresh) {
          newsData = result.returnData.artcs;
        } else {
          newsData = [...this.data.newsData, ...result.returnData.artcs];
        }
        this.setData({
          newsData: newsData,
          total: result.returnData.total,
          pagetotal: result.returnData.pagetotal,
        });
      }

      console.log(this.data.newsData);
    } catch (e) {
      console.log(e)
    }
    if (isRefresh) {
      wx.stopPullDownRefresh()
    }
    wx.hideLoading()

  },
  goNewsDetail: function (e) {
    let entity = e.target.dataset.entity
    if (!entity) {
      return
    }
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
    this.getLanguage()
    this.setTabLocale()
    this.getGroups(() => {
      this.getSchoolInfoList();
    })
  },
  onShow: function () {
    let locale = wx.getStorageSync('locale')
    if (this.data.locale != locale) {
      this.getLanguage()
      this.setTabLocale()
      this.getSchoolInfoList();
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getTabBorderWidth()
  },
  //页面下拉刷新
  onPullDownRefresh: function () {

    this.getSchoolInfoList(1, false, true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.showBottomLine) {
      return
    }

    if (this.data.pagenum == this.data.pagetotal) {
      wx.hideLoading();
      return
    }
    let pagenum = parseInt(this.data.pagenum) + 1
    this.getSchoolInfoList(pagenum, true, false)
  },

  jumpToNewDetail(e) {
    console.log(e)
    let entity = e.currentTarget.dataset.entity

    if (!entity) {
      return
    }
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
  jumpToNews() {
    wx.navigateTo({
      url: '/pages/news/news',
    })
  },
  jumpToApply() {
    wx.navigateTo({
      url: '/pages/signup/signup?formid=1huowz7ek16vb15qwzv1dj1cyl9r7a53'
    })
  },
  jumpToProfessor() {
    wx.navigateTo({
      url: '/pages/gaojin/professor/professor',
    })
  },
  jumpToSalfer() {
    wx.navigateTo({
      url: '/pages/gaojin/salfer/salfer',
    })
  },
  jumpUrlFirst() {
    wx.navigateTo({
      url: `/pages/outside/outside?webview_url=${url1}`,
    })
  },
  jumpUrlSecond() {
    wx.navigateTo({
      url: `/pages/outside/outside?webview_url=${url2}`,
    })
  }
})

Page(PageObject)