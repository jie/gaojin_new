import AfformBehaviors from '../afform_behaviors.js'
import OptionBehaviors from '../option_behaviors.js'


function toDecimal2(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(x * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
}

Component({
  behaviors: [AfformBehaviors, OptionBehaviors],
  properties: {
    options: {
      type: Array,
      value: []
    },
    prices: {
      type: Array,
      value: []
    }
  },
  data: {
    dataField: "optionDataValues",
    msgMap: {},
    counter: 0,
    total: 0,
    _val: []
  },
  ready() {
    if (this.data.initValue) {
      this.changeOptionByOptId(this.data.initValue)
    }
  },
  methods: {
    validate: function () {
      if (this.data.required === "1" && this.data._val.length === 0) {
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
    },
    onlongpressOption: function (e) {
      // wx.previewImage({
      //   current: '../../../assets/images/avatar.jpg',
      //   urls: ['../../../assets/images/avatar.jpg']
      // })
    },
    onUpdateCounter: function (e) {
      console.log('onUpdateCounter:', e)
      let flag = false
      let targetItem = null
      let prices = this.data.prices
      for (let i = 0; i < this.data.options.length; i++) {
        if (this.data.options[i].optId === e.detail.optId) {
          targetItem = this.data.options[i]
          targetItem.counter = e.detail.counter
          targetItem.total = toDecimal2(parseFloat(e.detail.price) * parseInt(e.detail.counter))
          console.log(e.detail)
          console.log(targetItem)
        }
      }

      for (let i = 0; i < this.data.prices.length; i++) {
        if (this.data.prices[i].optId === targetItem.optId) {
          prices[i] = targetItem
          flag = true
        }
      }

      if (flag === false) {
        prices.push(targetItem)
      }

      let not_empty = []
      for (let i = 0; i < prices.length; i++) {
        if (parseInt(prices[i].counter) !== 0) {
          not_empty.push(i)
        }
      }

      let not_empty_prices = []
      for (let item of not_empty) {
        not_empty_prices.push(prices[item])
      }

      let total = 0;
      for (let item of not_empty_prices) {
        total += parseFloat(item.total)
      }

      let dataValues = []
      for (let item of not_empty_prices) {
        dataValues.push({
          optId: item.optId,
          dataValue: item.counter.toString()
        })
      }

      this.setData({
        prices: not_empty_prices,
        total: toDecimal2(total),
        _val: dataValues
      })
      this.setData({
        err: ''
      })
      this.triggerEvent("action", {
        value: dataValues,
        cpntId: this.data.cpntId,
        dataField: this.data.dataField
      })
    },
    changeOptionByOptId: function (initValue) {
      // for (let optId of optIds) {
      //   this.data.selectedOpts[optId] = true
      // }
      // this.setData({
      //   selectedOpts: this.data.selectedOpts
      // })

      // let __optIds = []
      // for (let i = 0; i < this.data.options.length; i++) {
      //   if (optIds.includes(this.data.options[i].optId)) {
      //     __optIds.push(i)
      //   }
      // }
      // console.log('checkbox: optIds:', optIds)
      // this.optionsChange({ detail: { value: __optIds } })
      let prices = []
      for (let item of this.data.options) {
        console.log('item:', item)
        for (let buyItem of initValue) {
          if (item.optId == buyItem.cpntOptId) {
            var priceItem = {
              actionType: "AF_FORM_COUNTER_UPDATE",
              price: toDecimal2(parseFloat(item.goodsPrice)),
              counter: parseInt(buyItem.dataValue),
              optId: item.optId
            }
            this.onUpdateCounter({
              detail: priceItem
            })
            prices.push(priceItem)
          }
        }
      }
      // this.setData({
      //   prices: prices
      // })
    }
  }
})
