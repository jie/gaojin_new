// libs/components/fullscreen_dialog/fullscreen_dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    entities: {
      type: Array,
      value: [] 
    },
    title: {
      type: String,
      value: null
    },
    height: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    myHeight: 0
  },
  methods: {
    tapConfirm: function(e) {
      this.triggerEvent('fullscreenDialogPicked', e.target.dataset.index)
    },
    tapCancel: function(e) {
      this.triggerEvent('fullscreenDialogCancel')
    }
  }
})
