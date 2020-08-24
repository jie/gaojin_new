import regeneratorRuntime from '../../../libs/regenerator-runtime/runtime'
import { getMemberInfoList } from '../../../campus_lib/api'
import PageBehavior from '../../../utils/page_behaviors'
import mergePages from '../../../libs/objectUtils' 
var WxParse = require('../../../libs/wxParse/wxParse.js');

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
    total:0,
    isPop:false
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
  getSaiferInfoList: async function (index, curr = 1, isAppend = false, isRefresh = false) {
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
      let result = await getMemberInfoList(this.data.schoolID,1, data)
      console.log('============================= response get success =============================')

      if (!result.status && result.code !== 10005) {
        wx.hideLoading()
        this.showToast(result.info)
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
          item.memberPhoto = this.data.campusServerAddr + item.memberPhoto
          let vm = this;
          WxParse.wxParse('memberIntroduce', 'html', item.memberIntroduce, vm, 5);
        }

        if(isRefresh){
          membersData = result.returnData.list;
        }else{
          membersData = [...this.data.membersData, ...result.returnData.list];
        }
      }
      this.setData({
        membersData:membersData,
        total:result.returnData.count
      });
    } catch (e) {
      console.log(e)
    }
    if (isRefresh) {
      wx.stopPullDownRefresh()
    }
    wx.hideLoading()

  },
  
  _onLoad: function (options) {
    this.getSaiferInfoList(this.data.schoolID);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.popup = this.selectComponent("#popup");
    // this.getTabBorderWidth()
  },
  //页面下拉刷新
  onPullDownRefresh: function () {
    this.getSaiferInfoList(this.data.currentCategory, 1, false, true)
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
    this.getSaiferInfoList(this.data.currentCategory, curr, true, false)
  },
  showPopup(event){
    let info = event.currentTarget.dataset.member;
    console.log(info)
    this.popup.memberInfo = info;
    this.setData({
      isPop:true
    });
    this.popup.showPopup(info,this);

    
  }
})

Page(PageObject)
