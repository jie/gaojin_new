import AfformBehaviors from '../afform_behaviors.js'
import OptionBehaviors from '../option_behaviors.js'
import { compareKey } from '../../../libs/arrUtils'
Component({
  behaviors: [AfformBehaviors, OptionBehaviors],
  properties: {
  },

  data: {
    dataField: "optionDataValues",
  },
  ready() {
    this.updateOptions()
    console.log('initValue:', this.data.initValue)
    if (this.data.initValue) {
      this.changeOptionByOptId(this.data.initValue)
    }
  },
  methods: {
    optionsChange: function (e) {
      let dataValues = []
      let selectedOpts = {}
      for (let item of e.detail.value) {
        dataValues.push({
          optId: this.data.options[parseInt(item)].optId,
          dataValue: this.data.options[parseInt(item)].optValue
        })
        selectedOpts[this.data.options[parseInt(item)].optId] = true
      }
      this.setData({
        _val: dataValues,
        err: '',
        selectedOpts: selectedOpts,
        otherInputValue: ''
      })
      this.triggerEvent("action", {
        value: dataValues,
        cpntId: this.data.cpntId,
        dataField: this.data.dataField
      });
    },
    updateOptions: function () {
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
    onInputFocus(e) {
      console.log(e)
      this.setData({
        selectedOpts: {}
      })
    }
  }
})
