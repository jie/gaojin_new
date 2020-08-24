// campus_lib/components/searchbar/searchbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isFocus: {
      type: Boolean,
      value: false
    },
    searchText: {
      type: String,
      value: 'Search'
    },
    cancelText: {
      type: String,
      value: 'Cancel'
    },
    themeColor: {
      type: String,
      value: '#22A1F9'
    },
    placeholder: {
      type: String,
      value: 'Search'
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
    onFocusSearchbar: function() {
      this.setData({
        isFocus: true
      })
    },
    onBlur: function() {
      // this.setData({
      //   isFocus: false
      // })
    },
    handleConfirm: function(e) {
      console.log(e)
      this.triggerEvent('SearchEvent', e.detail.value)
    },
    tapCancel: function(e) {
      this.setData({
        searchText: '',
        isFocus: false
      })
      this.triggerEvent('SearchEvent', null)
    }
  }
})
