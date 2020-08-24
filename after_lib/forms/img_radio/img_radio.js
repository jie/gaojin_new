import AfformBehaviors from '../afform_behaviors.js'
import OptionBehaviors from '../option_behaviors.js'
import ImageBehaviors from '../image_behaviors.js'
Component({
  behaviors: [
    AfformBehaviors,
    OptionBehaviors,
    ImageBehaviors
  ],
  properties: {
    defaultOptIds: {
      type: Array
    },
    options: {
      type: Array,
      value: []
    },
    selectedIndex: {
      type: Number,
      value: -1
    }
  },
  data: {
    dataField: "optionDataValues",
  },
  attached: function() {
    this.renderElement()
  },
  ready() {
    if (this.data.initValue) {
      this.changeOptionByOptId(this.data.initValue)
    }
  },
  methods: {
    renderElement: function () {
      let nodes = [{
        name: 'div',
        attrs: {
          class: 'af-rich-desc'
        },
        children: [{
          type: 'text',
          text: this.data.desc
        }]
      }]
      this.setData({
        nodes: nodes
      })
    },
    optionsChange: function(e) {
      let index = e.target.dataset.index

      if(this.data.formatedOptions[index].disabled == 'disabled') {
        return
      }

      let selectedOpts = {}
      let dataValue = [
        {
          optId: this.data.options[index].optId,
          dataValue: this.data.options[index].optValue
        }
      ]
      selectedOpts[this.data.options[index].optId] = true
      this.setData({
        selectedIndex: index,
        selectedOpts: selectedOpts,
        _val: dataValue,
        err: ''
      })
      this.triggerEvent("action", {
        value: dataValue,
        cpntId: this.data.cpntId,
        dataField: this.data.dataField
      })
    }
  }
})
