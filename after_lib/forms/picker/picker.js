import AfformBehaviors from '../afform_behaviors.js'
import OptionBehaviors from '../option_behaviors.js'
import { compareKey } from '../../../libs/arrUtils'
Component({
  behaviors: [AfformBehaviors, OptionBehaviors],
  properties: {
    "options": {
      type: Array,
      value: []
    },
    "showOptions": {
      type: Boolean,
      value: false
    },
    "defaultTip": {
      type: String,
      value: ""
    },
    "selected": {
      type: Number,
      value: null
    },
    "cancelText": {
      type: String,
      value: ""
    },
    "confirmText": {
      type: String,
      value: ""
    }
  },

  data: {
    dataField: "optionDataValues",
    formatedOptions: [],
  },
  attached() {
    this.updateOptions()
    this.initialize()
  },
  ready() {
    
    if (this.data.initValue) {
      this.changeOptionByOptId(this.data.initValue)
    }
    
  },
  methods: {
    initialize: function() {
      let formatedOptions = []
      console.log('****options*****', this.data.options)
      let options = this.getFormatedOptions()
      for(let item of options) {
        formatedOptions.push(item.optValue)
      }
      if (this.data.locale == 'zh-CN') {
        this.setData({
          cancelText: '取消',
          confirmText: '确定',
          formatedOptions: [formatedOptions],
          rawOptions: options
        })
      } else {
        this.setData({
          cancelText: 'Cancel',
          confirmText: 'Confirm',
          formatedOptions: [formatedOptions],
          rawOptions: options
        })
      }
    },
    confirmCallBack: function(e) {
      console.log('=====confirmCallBack=====')
      console.log(e)

      let index = e.detail.choosedIndexArr[0]
      let dataValues = [{
        optId: this.data.options[index].optId,
        dataValue: this.data.options[index].optValue
      }]
      console.log('========== dataValues ===========')
      console.log(dataValues)

      // this.triggerEvent("action", {
      //   value: dataValues,
      //   cpntId: this.data.cpntId,
      //   dataField: this.data.dataField
      // })
      // this.setData({
      //   selected: index,
      //   showOptions: false,
      //   _val: dataValues,
      //   err: ''
      // })

      if(dataValues && dataValues[0].optId!=='otherOptionId') {
        this.triggerEvent("action", {
          value: dataValues,
          cpntId: this.data.cpntId,
          dataField: this.data.dataField
        })

      } else if(dataValues && dataValues[0].optId === 'otherOptionId') {
        this.triggerEvent("action", {
          value: [],
          cpntId: this.data.cpntId,
          otherInputValue: e.detail.value
        })
      }

      this.setData({
        selected: index,
        showOptions: false,
        _val: dataValues,
        err: ''
      })

    },
    cancleCallBack: function(e) {
      console.log('=====cancleCallBack=====')
      console.log(e)
      this.setData({
        showOptions: false
      })
      console.log('cancel')
    },
    togglePicker: function() {
      this.setData({
        showOptions: !this.data.showOptions
      })
    },
    closePicker: function() {
      this.setData({
        showOptions: false
      })
      console.log('closePicker:', this.data.closePicker)
    },
    showPicker: function() {
      this.setData({
        showOptions: true
      })
      console.log('showPicker:', this.data.showOptions)
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
          this.confirmCallBack({ detail: { choosedIndexArr: [i] } })
          break
        }
      }
    },
    updateOptions: function () {
      let options = this.data.options
      if (this.data.otherOption == '2') {
        options.push({
          optId: 'otherOptionId',
          optValue: this.data.otherOptionLabel
        })
      }
      
      this.setData({
        options: options,
        selected: options.length -1
      })

      if(this.data.initValue && this.data.initValue.length!=0){
        this.data.initValue.map((item) => {
          if(!item.cpntOptId) {
            this.setData({
              otherInputValue: item.dataValue
            })
          }
        })
      }

    },
  }
})
