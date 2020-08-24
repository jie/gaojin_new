import AfformBehaviors from '../afform_behaviors.js'
import OptionBehaviors from '../option_behaviors.js'
import { compareKey } from '../../../libs/arrUtils'
Component({
  behaviors: [AfformBehaviors, OptionBehaviors],
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    dataField: "optionDataValues"
  },
  ready() {
    this.updateOptions()
    if (this.data.initValue) {
      console.log('ready initValue: ', this.data.initValue)
      this.changeOptionByOptId(this.data.initValue)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    optionsChange: function(e) {
      let dataValues = []
      let selectedOpts = {}
      for(let item of e.detail.value) {
        dataValues.push({
          optId: this.data.options[parseInt(item)].optId,
          dataValue: this.data.options[parseInt(item)].optValue
        })
        selectedOpts[this.data.options[parseInt(item)].optId] = true
      }
      this.setData({
        _val: dataValues,
        err: '',
        selectedOpts: selectedOpts
      })
      this.triggerEvent("action", {
        value: dataValues,
        cpntId: this.data.cpntId,
        dataField: this.data.dataField
      });
    },
    updateOptions: function() {
      let options = this.data.options
      options.sort(compareKey('optSortNum'))
      this.setData({
        options: options
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
    changeOptionByOptId: function (optIds) {
      for (let optId of optIds) {
        this.data.selectedOpts[optId.cpntOptId] = true
      }
      this.setData({
        selectedOpts: this.data.selectedOpts
      })
      console.log('selectedOpts:', this.data.selectedOpts)
      let __optIds = []
      for (let i = 0; i < this.data.options.length; i++) {
        if (this.data.selectedOpts[this.data.options[i].optId]) {
          this.data.options[i].checked = true
          __optIds.push(i)
        }
      }
      this.setData({
        options: this.data.options
      })
      this.optionsChange({ detail: { value: __optIds } })
      
    }
  }
})
