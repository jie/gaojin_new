import regeneratorRuntime from '../../../libs/regenerator-runtime/runtime'
import { getVideoInfoList } from '../../../campus_lib/api'
import PageBehavior from '../../../utils/page_behaviors'
import mergePages from '../../../libs/objectUtils' 

const PageObject = mergePages({}, PageBehavior, {

  data: {
    pageName: 'member',
    curr: 1,
    limit: 20,
    categoryID: null,
    categories: [],
    entities: [],
    currentCategory: 0,
    tabBorderX: 0,
    tabBorderWidth: 0,
    categoriesWidth: [],
    categoriesPosX: [],
    scrollLeft: 0,
    distance: 0,
    membersData:[],
    total:0
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
  getVideoList: async function (index, curr = 1, isAppend = false, isRefresh = false) {
    wx.showLoading({
      title: this.data.language.base.loading,
    });
    
    try {

      

      let data = {
        curr: curr || this.data.curr,
        limit: this.data.limit
      }
      this.setData({
        curr:curr
      });
      if (this.data.locale == 'en-US') {
        data.infoLanguage = 'EN'
      } else {
        data.infoLanguage = 'CN'
      }

      data.categoryID = ''
      let result = await getVideoInfoList(this.data.schoolID, data)
      console.log('============================= response get success =============================')

      if (!result.status && result.code !== 10005) {
        wx.hideLoading()
        wx.showToast({
          title:result.info,
          icon:'none',
          duration:1000
        })
        return
      }
      
      if (result.code == 10005) {
        wx.hideLoading()
        result.returnData = {
          list: [],
          curr: 1,
          limit: 20,
        }
      }
      let membersData = [];
    
      if(result.code == 200){
        for(let item of result.returnData.list){
          
        }

        if(isRefresh){
          membersData = result.returnData.list;
        }else{
          membersData = [...this.data.membersData, ...result.returnData.list];
        }
        this.setData({
          membersData:membersData,
          total:result.returnData.count
        });
      }
      
      console.log(this.data.membersData);
      console.log(this.data.membersData.length)
    } catch (e) {
      console.log(e)
    }
    if (isRefresh) {
      wx.stopPullDownRefresh()
    }
    wx.hideLoading()

  },
  
  _onLoad: function (options) {
    this.getVideoList(this.data.schoolID);
    console.log('=============== show data ====================')
    console.log(this.data)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getTabBorderWidth()
  },
  //页面下拉刷新
  onPullDownRefresh: function () {
    console.log("===============我拉了=============")
    this.getVideoList(this.data.currentCategory, 1, false, true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.showBottomLine) {
      return
    }
    let length = this.data.membersData.length;
    if(this.data.total <= length ){
      wx.hideLoading();
      return
    }
    let curr = parseInt(this.data.curr) + 1
    this.getVideoList(this.data.currentCategory, curr, true, false)
  },
  
  jumpToNewDetail(){
    wx.navigateTo({
        url: '/pages/gaojin/news_detail/news_detail?id=1',
      })
  },
  jumpToNews(){
    wx.navigateTo({
      url: '/pages/news/news',
    })
  },
  jumpToVideo(){
    wx.navigateTo({
      url: '/pages/gaojin/video_list/video_list',
    })
  },
  jumpToProfessor(){
      wx.navigateTo({
      url: '/pages/gaojin/professor/professor',
    })
  },
  jumpToSalfer(){
    wx.navigateTo({
      url: '/pages/gaojin/salfer/salfer',
    })
  }
})

Page(PageObject)

// // pages/gaojin/professor/professor.js
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {

//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {

//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   }
// })