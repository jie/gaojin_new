// my-behavior.js
module.exports = Behavior({
  properties: {
    "options": {
      type: Array,
      value: []
    },
    "colsLayout": {
      type: String,
      value: "1"
    },
    "defaultOptIds": {
      type: Array,
      value: []
    },
    "otherOption": {
      type: String,
      value: "1"
    },
    "otherDataValue": {
      type: String,
      value: ""
    },
    "selectControl": {
      type: String,
      value: "1"
    },
    "selectControlValue": {
      type: String,
      value: "0"
    },
    "otherOptionName": {
      type: String,
      value: ""
    },
    "cpntSettings": {
      type: Object,
      value: {}
    }
  },
  attached: function () {
    console.log('options: ', this.data.options)
    if (this.data.selectControl !== '1') {
      this.initMsgMap()
    }

    if (!this.data.otherOptionName) {
      var otherLabel = ''
      if (this.data.locale == 'zh-CN') {
        otherLabel = '其他'
      } else {
        otherLabel = 'Other'
      }
      this.setData({
        otherOptionLabel: otherLabel
      })
    } else {
      this.setData({
        otherOptionLabel: this.data.otherOptionName
      })
    }
    this.getFormatedOptions()
  },
  data: {
    dataField: "dataValue",
    otherOptionLabel: "",
    otherInputValue: "",
    selectedOpts: {},
    formatedOptions: [],
    otherLimitationMsg: '',
    otherLimitationDisbaled: ''
  },
  methods: {
    getFormatedOptions: function () {
      let options = []
      let limitationMsg = ''
      if (this.data.locale == 'en-US') {
        limitationMsg = 'limit'
      } else {
        limitationMsg = '剩余'
      }

      for (let item of this.data.options) {
        item.disabled = ''
        if (this.data.cpntSettings.displayStockNum == 2) {
          if (item.limitOptStock == 2) {
            item.limitationMsg = `[${limitationMsg} ${item.fnOptStockNum}]`
            if(item.fnOptStockNum == '0') {
              item.disabled = 'disabled'
            }
          }
        }
        options.push(item)
      }
      this.setData({
        formatedOptions: options
      })

      if(this.data.cpntSettings.limitOtherOptStock == '2') {
        this.setData({
          otherLimitationMsg: `[${limitationMsg} ${this.data.cpntSettings.fnOtherOptStockNum}]`,
          otherLimitationDisbaled: this.data.cpntSettings.fnOtherOptStockNum == '0' ? 'disabled': ''
        })
      }
      return options
    },
    onOtherInputChange: function (e) {
      this.setData({
        otherDataValue: e.detail.value,
        _val: [e.detail.value],
        err: ''
      })
      this.triggerEvent("action", {
        value: e.detail.value,
        cpntId: this.data.cpntId,
        otherDataValue: e.detail.value
      })
    },
    validateMaxOpts: function () {
      let maxCount = parseInt(this.data.selectControlValue)
      let counter = 0;
      for (let item of this.data.options) {
        if (counter >= maxCount) {
          if (this.data.locale == 'en-US') {
            return {
              status: false,
              message: `select at most ${maxCount} options`
            }
          } else {
            return {
              status: false,
              message: `最多选择${maxCount}项`
            }
          }
        }
        if (item.selected) {
          counter += 1
        }
      }
      return {
        status: true,
        message: ''
      }
    },
    initMsgMap: function () {
      if (this.data.locale == 'en-US') {
        this.setData({
          msgMap: {
            '1': null,
            '2': `Please select at least ${this.data.selectControlValue} options`,
            '3': `Please select at most ${this.data.selectControlValue} options`,
            '4': `Please select ${this.data.selectControlValue} options`,
          }
        })
      } else {
        this.setData({
          msgMap: {
            '1': null,
            '2': `请至少选择${this.data.selectControlValue}项`,
            '3': `请至多选择${this.data.selectControlValue}项`,
            '4': `请选择${this.data.selectControlValue}项`,
          }
        })
      }
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
          this.optionsChange({
            detail: {
              value: [i]
            }
          })
          break
        }
      }
      initValue.map((item) => {
        if (!item.cpntOptId) {
          this.setData({
            otherInputValue: item.dataValue
          })
        }
      })
    }
  }
})