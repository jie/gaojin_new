// utils/tab/tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selectedColor: {
      type: String,
      value: '#22A1F9'
    },
    selected: {
      type: Number,
      value: 0
    },
    tabItems: {
      type: Array,
      value: [

      ]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelectTabItem: function(e) {
      console.log(e)
      this.setData({
        selected: e.target.dataset.index
      })
      this.triggerEvent("action", {
        actionType: 'AF_TAB_CHANGED',
        index: this.data.selected,
        key: this.data.tabItems[this.data.selected].key
      })
    }
  }
})
