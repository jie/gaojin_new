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
      value: ""
    }
  },

  data: {
    dataField: "optionDataValues"
  },
  ready() {
    this.updateOptions()
  },

  methods: {
    selectChange: function (e) {
      let dataValues = []
      for (let item of this.data.options) {
        if (item.optId == e.target.dataset.optid) {
          dataValues.push({
            optId: item.optId,
            dataValue: item.optValue
          })
        }
      }

      this.triggerEvent("action", {
        value: dataValues,
        cpntId: this.data.cpntId,
        dataField: this.data.dataField
      });
      this.setData({
        selected: e.target.dataset.selected,
        showOptions: false,
        _val: dataValues,
        err: ''
      })
    },
    ontapSelectHeader: function(e) {
      this.setData({
        showOptions: true
      })
    },
    updateOptions: function () {
      let options = this.data.options
      if (this.data.otherOption == '2') {
        options.push({
          optId: '',
          optValue: '其他'
        })
      }
      
      this.setData({
        options: options
      })
    },
    closeOptions: function() {
      this.setData({
        showOptions: false
      })
    }
  }
})
