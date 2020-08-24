import AfformBehaviors from '../afform_behaviors.js'
Component({
  behaviors: [AfformBehaviors],
  properties: {
    "titleAlign": {
      type: String,
      value: "0"
    },
    "descAlign": {
      type: String,
      value: "0"
    },
    "formatedDesc": {
      type: Array,
      value: []
    }
  },


  /**
   * 组件的初始数据
   */
  data: {
    dataField: "dataValue",
    alignTypes: {
      1: 'left',
      2: 'center',
      3: 'right'
    }
  },
  /**
   * 组件的方法列表
   */
  attached: function() {
    // this.formatDesc()
    console.log(this.data.desc)
  },
  methods: {
    formatDesc: function() {
      if(this.data.desc.includes('<br>')) {
        let formatedDesc = this.data.desc.split('<br>')
        this.setData({
          formatedDesc: formatedDesc
        })
      } else {
        this.setData({
          formatedDesc: [this.data.desc]
        })
      }
    }
  }
})
