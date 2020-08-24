import AfformBehaviors from '../afform_behaviors.js'
import {
  apiSearchCity,
  apiSearchCityByRegion
} from '../../api'

import regeneratorRuntime from '../../../libs/regenerator-runtime/runtime.js'

let dCities = ["2", "25", "27", "32", "33", "34", "35"]

Component({
  behaviors: [AfformBehaviors],
  properties: {
    locale: {
      type: String,
      value: 'zh-CN'
    },
    multiIndex: {
      type: Array,
      value: [null, null, null]
    },
    locations: {
      type: Array,
      value: [[], [], []]
    }
  },


  /**
   * 组件的初始数据
   */
  data: {
    dataField: "dataValue",
    cityNameKey: 'cityName'
  },
  attached: function () {
    if(this.data.locale == 'zh-CN') {
      this.setData({
        cityNameKey: 'cityName'
      })
    } else {
      this.setData({
        cityNameKey: 'cityEnName'
      })
    }
    this.getCountries()
    console.log('===== cttlocation values =====')
    console.log(this.data.initValue)
  },
  methods: {
    onConfirmCity: function (city) {
      this.setData({
        _val: city,
        err: ''
      })
      this.triggerEvent("action", {
        value: city,
        cpntId: this.data.cpntId,
        dataField: this.data.dataField
      })
    },
    getCountries: async function() {
      let locations = this.data.locations
      if (this.data.locations[0].length === 0) {
        let result = await apiSearchCityByRegion({ parentIds: [0] })
        if (result.status) {
          locations[0] = result.returnData.datas || []
          this.setData({
            locations: locations
          })
          if (locations[0].length === 1) {
            let stateResult = await apiSearchCityByRegion({ parentIds: [locations[0][0].cityId] })
            if (stateResult.status) {
              let locations2 = this.data.locations
              locations2[1] = stateResult.returnData.datas
              this.setData({
                locations: locations2
              })
            }
          }
        }
      }
    },
    changeCountry: async function() {
      let locations = this.data.locations
      locations[1] = []
      locations[2] = []
      this.setData({
        locations: locations
      })
      let stateResult = await apiSearchCityByRegion({ parentIds: [this.data.locations[0][this.data.multiIndex[0]].cityId] })
      if(stateResult.status) {
        locations[1] = stateResult.returnData.datas
        locations[2] = []
        this.setData({
          locations: locations
        })
      }
    },
    changeState: async function() {
      let locations = this.data.locations
      locations[2] = []
      this.setData({
        locations: locations
      })
      let cityId = this.data.locations[1][this.data.multiIndex[1]].cityId
      let cityResult = await apiSearchCityByRegion({ parentIds: [cityId] })
      if (cityResult.status) {
        let locations = this.data.locations
        if (dCities.includes(cityId)) {
          locations[2] = [this.data.locations[1][this.data.multiIndex[1]]]
        } else {
          locations[2] = cityResult.returnData.datas
        }
        
        this.setData({
          locations: locations
        })
      }
    },
    bindMultiPickerChange(e) {
      console.log('picker:', e.detail.value)
      this.setData({
        multiIndex: e.detail.value
      })
      let cityId = this.data.locations[2][this.data.multiIndex[2]].cityId
      this.onConfirmCity(cityId)
    },
    bindMultiPickerColumnChange: async function(e) {
      console.log('column:', e.detail.column, ', value:', e.detail.value)
      let multiIndex = this.data.multiIndex
      switch (e.detail.column) {
        case 0:
          multiIndex = [0, null, null]
          this.setData({
            multiIndex: multiIndex
          })
          await this.changeCountry()
          break
        case 1:
          multiIndex[1] = e.detail.value
          multiIndex[2] = null
          await this.changeState()
          break
        case 2:
          multiIndex[2] = e.detail.value
          break
      }

    },
  }
})
