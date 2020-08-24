import AfformBehaviors from '../afform_behaviors.js'
import OptionBehaviors from '../option_behaviors.js'
import { compareKey } from '../../../libs/arrUtils'
Component({
  behaviors: [AfformBehaviors, OptionBehaviors],
  properties: {
  },

  data: {
    dataField: "optionDataValues"
  },
  ready() {
    this.updateOptions()
    if (this.data.initValue) {
      console.log('this.data.initValue:', this.data.initValue)
      this.changeOptionByOptId(this.data.initValue)
    }
  },
  methods: {
    optionsChange: function (e) {
      let dataValues = []
      for (let item of e.detail.value) {
        dataValues.push({
          optId: this.data.options[parseInt(item)].optId,
          dataValue: this.data.options[parseInt(item)].optValue
        })
      }
      this.setData({
        err: '',
        _val: dataValues
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
    }
  }
})
