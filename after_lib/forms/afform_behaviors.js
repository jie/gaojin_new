import language from './language'
module.exports = Behavior({
  properties: {
    "cpntId": {
      type: String,
      value: null
    },
    "title": {
      type: String,
      value: ""
    },
    "desc": {
      type: String,
      value: ""
    },
    "required": {
      type: String,
      value: ""
    },
    "formStyle": {
      type: Object,
      value: {}
    },
    "err": {
      type: String,
      value: ""
    },
    "locale": {
      type: String,
      value: 'zh-CN'
    },
    "language": {
      type: Object,
      value: {}
    },
    "fieldType": {
      type: String,
      value: ''
    },
    "initValue": {
      type: Array,
      value: []
    }
  },
  data: {
    dataField: "dataValue",
    nodes: [],
    _val: '',
    multipleOptionType: ['checkbox', 'imgCheckbox', 'goods']
  },
  ready: function() {
    this.getLanguage()
    if (this.data.initValue && this.data.initValue.length != 0) {
      if (this.data.multipleOptionType.includes(this.data.fieldType)) {
        this.onInputChange({
          detail: {
            value: this.data.initValue
          }
        })
      } else {
        console.log(`============= ${this.data.fieldType} ==============`)
        console.log(this.data.initValue)
        this.onInputChange({
          detail: {
            value: this.data.initValue[0].dataValue
          }
        })
      }
    }
  },
  methods: {
    getLanguage: function() {
      if (language[this.data.locale] && language[this.data.locale][this.data.fieldType]) {
        this.setData({
          language: {
            ...language[this.data.locale][this.data.fieldType],
            base: language[this.data.locale].base
          }
        })
      } else {
        this.setData({
          language: {
            base: language[this.data.locale].base
          }
        })
      }
    },
    onInputChange: function(e) {
      this.setData({
        _val: e.detail.value,
        err: ''
      })
      this.triggerEvent("action", {
        value: e.detail.value,
        cpntId: this.data.cpntId,
        dataField: this.data.dataField
      })
    },

    validate: function() {
      console.log('this.data.required :', this.data.required )
      console.log('this.data._val:', this.data._val)
      if (this.data.required === '1' && !this.data._val) {
        this.setData({
          err: '此项为必填项'
        })
        return {
          status: false,
          info: `此项为必填项`
        }
      } else {
        this.setData({
          err: ''
        })
        return {
          status: true,
          info: 'OK'
        }
      }
    }
  }
})