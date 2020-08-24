import AfformBehaviors from '../afform_behaviors.js'
Component({
  behaviors: [AfformBehaviors],
  properties: {
    dateValue: {
      type: String,
      default: ''
    },
    dateFormat: {
      type: String,
      default: '1'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dateFieldOptions: {
      "1": "day",
      "2": "month"
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindDateChange: function(e) {
      this.setData({
        dateValue: e.detail.value,
        _val: e.detail.value,
        err: ''
      })
      this.triggerEvent("action", {
        value: this.data.dateValue,
        cpntId: this.data.cpntId,
        dataField: this.data.dataField
      });
    }
  }
})
