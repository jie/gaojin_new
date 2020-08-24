import regeneratorRuntime from '../../../libs/regenerator-runtime/runtime'
import { getSchoolInfoList } from '../../../campus_lib/api'
import PageBehavior from '../../../utils/page_behaviors'
import mergePages from '../../../libs/objectUtils' 

const PageObject = mergePages({}, PageBehavior, {

  data: {
    pageName: 'project',
    curr: 1,
    limit: 20,
    currentCategory: 0,
    tabBorderX: 0,
    tabBorderWidth: 0,
    categoriesWidth: [],
    categoriesPosX: [],
    scrollLeft: 0,
    distance: 0,
  },

  onTabScroll: function (e) {
   
  },
  _onLoad: function (options) {
    console.log('=============================language========================')
    console.log(this.data.language)

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getTabBorderWidth()
  },
  //页面下拉刷新
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
   
  },
  jumpDetail1(){
    wx.navigateTo({
      url:  '/pages/gaojin/out_link/out_link?url=https://mba-events.saif.sjtu.edu.cn/program/full-time-fmba.php'
    })
  },
  jumpDetail2(){
    wx.navigateTo({
      url:  '/pages/gaojin/out_link/out_link?url=https://mba-events.saif.sjtu.edu.cn/program/part-time-fmba.php'
    })
  },
  jumpDetail3(){
    wx.navigateTo({
      url:  '/pages/gaojin/out_link/out_link?url=https://mba-events.saif.sjtu.edu.cn/program/global-fmba.php'
    })
  },
})

Page(PageObject)