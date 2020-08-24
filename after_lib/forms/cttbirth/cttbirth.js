import AfformBehaviors from '../afform_behaviors.js'
import moment from '../../../libs/moment.min.js'

function mGetDate(year, month) {
  var d = new Date(year, month, 0);
  return d.getDate();
}

Component({
  behaviors: [AfformBehaviors],
  properties: {
    dateValue: {
      type: String,
      default: ''
    }
  },

  data: {
    dateFieldOptions: {
      "1": "month",
      "2": "day"
    },
    months: [],
    day: []
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {
    console.log('===== initValue =====')
    console.log(this.data.initValue)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindDateChange: function (e) {
      this.setData({
        dateValue: e.detail.value
      })
    }
  }
})
