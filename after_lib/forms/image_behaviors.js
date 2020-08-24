// my-behavior.js
module.exports = Behavior({
  methods: {
    onlongpressOption: function (e) {
      let urls = []
      for (let item of this.data.options) {
        urls.push(item.accessUrl)
      }
      wx.previewImage({
        current: urls[e.target.dataset.index],
        urls: urls
      })
    },
    changeOptionByOptId: function (initValue) {
      console.log('initValue:', initValue)
      let initOptIds = initValue.map((item) => {
        return item.cpntOptId
      })
      for (let i = 0; i < this.data.options.length; i++) {
        if (initOptIds.includes(this.data.options[i].optId)) {
          this.data.options[i].checked = true
          this.setData({
            options: this.data.options
          })
          this.optionsChange({ target: { dataset: { index: i } } })
          break
        }
      }
    }
  }
})