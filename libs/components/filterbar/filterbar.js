Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    entities: {
      type: Array,
      value: []
    },
    allItems: {
      type: Array,
      value: []
    },
    headerItems: {
      type: Array,
      value: []
    },
    maxheight: {
      type: Number,
      value: 200
    },
    headerHeight: {
      type: Number,
      value: 40
    },
    duration: {
      type: Number,
      value: 500
    },
    isOpen: {
      type: Boolean,
      value: false
    },
    isDark: {
      type: Boolean,
      value: false
    },
    closePanelDuration: {
      type: Number,
      value: 1000
    },
    enviroment: {
      type: String,
      value: ''
    }
  },
  data: {
    currentIndex: null,
    isShowItems: false,
    actionCls: 'slideInDown',
    currentItems: [],
  },
  observers: {
    'isOpen': function (isOpen) {
      if(isOpen === false) {
        this.closeFilter()
      }
    }
  },
  methods: {
    ontapBarItem: function (e) {
      let index = e.currentTarget.dataset.tapindex
      if(this.data.headerItems[index].slotName) {
        return
      }
      if (index !== this.data.currentIndex) {
        this.setData({
          actionCls: 'slideOutUp'
        })
        setTimeout(()=>{
          this.setData({
            currentIndex: index,
            currentItems: this.data.entities[index],
            actionCls: 'slideInDown'
          })
        }, this.data.duration)
      } else {
        this.closeFilter()
      }
      this.triggerEvent("onFilterTabChanged", {
        col: index
      })
    },
    closeFilter: function() {
      this.setData({
        actionCls: 'slideOutUp'
      })
      setTimeout(() => {
        this.setData({
          currentIndex: null,
          currentItems: [],
        })
      }, this.data.duration)
    },
    ontapItem: function(e) {
      this.triggerEvent("onFilterItemChanged", {
        index: e.currentTarget.dataset.tapindex,
        col: e.currentTarget.dataset.tapcol
      })

      setTimeout(()=>{
        this.closeFilter()
      }, this.data.closePanelDuration)
    },
    ontapAllItem: function(e) {
      this.triggerEvent("onFilterAllItemChanged", {
        index: e.currentTarget.dataset.tapindex
      })
      setTimeout(() => {
        this.closeFilter()
      }, this.data.closePanelDuration)
    }
  }
})
