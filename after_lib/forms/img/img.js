import AfformBehaviors from '../afform_behaviors.js'
Component({
  behaviors: [AfformBehaviors],
  properties: {

    // cpntId
    // type
    // sortNum
    // cpntStatus
    // desc
    // descAlign
    // imgDisplayType
    // linkUrl
    // imgSource
    // extImgUrl
    // fileName
    // isUpload


    "cpntId": {
      type: String,
      value: null
    },
    "type": {
      type: String,
      value: "1"
    },
    "sortNum": {
      type: String,
      value: "1"
    },
    "cpntStatus": {
      type: String,
      value: "1"
    },
    "desc": {
      type: String,
      value: ""
    },
    "descAlign": {
      type: String,
      value: ""
    },

    "imgDisplayType": {
      type: String,
      value: ""
    },

    "linkUrl": {
      type: String,
      value: ""
    },
    "imgSource": {
      type: String,
      value: ""
    },
    "extImgUrl": {
      type: String,
      value: ""
    },
    "accessUrl": {
      type: String,
      value: null
    },
    "fileName": {
      type: String,
      value: ""
    },
    "isUpload": {
      type: String,
      value: ""
    }
  },


  /**
   * 组件的初始数据
   */
  data: {
    dataField: "dataValue",
    imgDisplayTypes: {
      "1": "stretch",
      "2": "center"
    },
    descAlignTypes: {
      "1": "left",
      "2": "center",
      "3": "right"
    },
    width: null,
    height: null
  },
  ready() {
    if(this.data.imgDisplayType == '2') {
      this.initImage(this.data.extImgUrl)
    }
    console.log('**************** img ***************')
    console.log(this.data.initValue)
  },
  methods: {
    initImage: function(src) {
      wx.getImageInfo({
        src: src,
        success: (res)=>{
          this.setData({
            width: res.width,
            height: res.height
          })
        }
      })
    }
  }
})
