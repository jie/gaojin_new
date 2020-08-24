import AfformBehaviors from '../afform_behaviors.js'
Component({
  behaviors: [AfformBehaviors],
  properties: { 
    inputType: {
      type: String,
      value: "text"
    }
  },


  /**
   * 组件的初始数据
   */
  data: {
    dataField: "dataValue"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})
