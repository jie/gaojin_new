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
      type: Array,
      value: []
    },
    options: {
      type: Array,
      value: []
    }
  },

  data: {
    dataField: "optionDataValues",
    msgMap: {}
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
      let options = this.data.options;

      if(this.data.formatedOptions[index].disabled == 'disabled') {
        return
      }
      if(options[index].selected) {
        options[index].selected = false
      } else {

        if (this.data.selectControl === "3") {
          let result = this.validateMaxOpts()
          if (!result.status) {
            this.triggerEvent("action", {
              actionType: 'AF_FORM_VALIDATE_ERR',
              cpntId: this.data.cpntId,
              message: result.message
            });
            return
          }
        }

        options[index].selected = true
      }

      let dataValues = []
      let selectedOpts = {}
      for(let i=0; i<options.length; i++) {
        if(options[i].selected) {
          dataValues.push({
            optId: options[i].optId,
            dataValue: options[i].optValue
          })
          selectedOpts[options[i].optId] = true
        }
      }

      this.setData({
        options: options,
        selectedOpts: selectedOpts,
        _val: dataValues,
        err: ''
      })

      this.triggerEvent("action", {
        value: dataValues,
        cpntId: this.data.cpntId,
        dataField: this.data.dataField
      });
    },
    changeOptionByOptId: function (initValue) {
      for (let i = 0; i < this.data.options.length; i++) {
        for(let item of initValue) {
          console.log('i:', this.data.options[i].optId, ', optId:', item.cpntOptId)
          if (item.cpntOptId == this.data.options[i].optId) {
            this.optionsChange({ target: { dataset: { index: i } } })
          }
        }
      }
    }
  }
})
