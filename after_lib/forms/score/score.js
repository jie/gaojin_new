import AfformBehaviors from '../afform_behaviors.js'
import OptionBehaviors from '../option_behaviors.js'
import { compareKey } from '../../../libs/arrUtils'
Component({
  behaviors: [AfformBehaviors, OptionBehaviors],
  properties: {
    starNum: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dataField: "dataValue",
    starOffSrc: '../_icons/star-off.png',
    starOnSrc: '../_icons/star-on.png'
  },
  attached() {
    this.updateOptions()
  },
  ready() {
    if (this.data.initValue) {
      this.changeOptionByOptId(this.data.initValue)
    }
  },
  methods: {
    checkboxChange: function (e) {
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
      let options = []
      for(let i=1; i<=parseInt(this.data.starNum); i++) {
        options.push({
          stars: i,
          selected: false
        })
      }
      this.setData({
        options: options
      })
    },
    ontapStar: function(e) {
      let stars = e.target.dataset.stars
      let options = this.data.options

      for (let i = 0; i <= (this.data.starNum - 1); i++) {
        options[i].selected = false
      }

      for (let i = 0; i <= (stars - 1); i++) {
        options[i].selected = true
      }
      this.setData({
        options: options
      })
      this.triggerEvent("action", {
        value: stars.toString(),
        cpntId: this.data.cpntId,
        dataField: this.data.dataField
      });
    },
    changeOptionByOptId: function (initValue) {
      this.ontapStar({target: {dataset: {stars: initValue[0].dataValue}}})
    }
  }
})
