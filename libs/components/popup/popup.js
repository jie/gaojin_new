var WxParse = require('../../wxParse/wxParse.js');
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    
   
  },
 
  /**
   * 组件的初始数据
   */
  data: {
    flag: true,
    memberInfo:{
        memberName:'顾伟',
        memberPhoto:'https://upload.jianshu.io/users/upload_avatars/7140391/b3fdb3b1-87af-4587-a843-2a0aa80c2cf0.png?imageMogr2/auto-orient/strip|imageView2/1/w/80/h/80',
        memberTitle:'2011级',
        memberContent:''
    },
    that:null
  },
 
  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hidePopup: function () {
      this.setData({
        flag: !this.data.flag,
      })
      this.data.that.setData({
        isPop:false
      });
    },
    //展示弹框
    showPopup (info,that) {
      console.log(info);
      console.log('=============================showPopLog+============================')
      let vm = this;
      WxParse.wxParse('memberIntroduce', 'html', info.memberIntroduce, vm, 5);
      this.setData({
        flag: !this.data.flag,
        memberInfo: info,
        that:that
      })
    },
    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */
    _success () {
      //触发成功回调
      this.hidePopup();
    }
  }
})