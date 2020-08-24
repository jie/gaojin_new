import regeneratorRuntime from '../../../libs/regenerator-runtime/runtime'
import {
  reqAlumniAPI,
  reqDevelopAPI
} from '../../api'

Component({
  properties: {
    countryID: {
      type: String,
      default: null
    },
    provinceID: {
      type: String,
      default: null
    },
    cityID: {
      type: String,
      default: null
    },
    displaytext: {
      type: String,
      default: ''
    }
  },
  data: {
    index: 0,
    multiArray: [
      [], [], []
    ],
    multiIndex: [0, 0, 0],
    myCountryID: null,
    myProvinceID: null,
    myCityID: null,
    myDisplayText: '',
    locale: null
  },
  attached: async function () {

    let displayInfo = this.data.locale == 'en-US'? 'Please choose':'请选择所在地'
    this.getLocale()
    this.setData({
      myCountryID: this.data.countryID,
      myProvinceID: this.data.provinceID,
      myCityID: this.data.cityID,
      myDisplayText: this.data.displaytext || displayInfo
    })
    await this.getCountries()
  },
  methods: {
    getLocale: function () {
      let locale = wx.getStorageSync('locale')
      if (locale == 'en-US') {
        this.setData({
          locale: 'en-US'
        })
      } else {
        this.setData({
          locale: 'zh-CN'
        })
      }
    },
    showToast: function (info) {
      wx.showToast({
        title: info,
        icon: 'none',
        duration: 2000
      })
    },
    getDisplayText: function () {
      this.setData({
        myDisplayText: `${this.data.multiArray[0][this.data.multiIndex[0]].countryNameCN}, ${this.data.multiArray[1][this.data.multiIndex[1]].provinceNameCN}, ${this.data.multiArray[2][this.data.multiIndex[2]].cityNameCN}`
      })
    },
    getCountries: async function () {
      let result = await reqAlumniAPI('api/read/local/countryList', { limit: 1000 })
      console.log('getCountries:', result)
      if (!result.status && result.code !== 10005) {
        this.showToast(result.info)
        return
      }
      let entities = []
      if (result.returnData && result.returnData.list) {
        for (let item of result.returnData.list) {
          if (this.data.locale == 'en-US') {
            item.name = item.countryNameEN
          } else {
            item.name = item.countryNameCN
          }
          entities.push(item)
        }

      }

      this.data.multiArray[0] = entities
      this.setData({
        multiArray: this.data.multiArray
      })
      if (!this.data.myCountryID) {
        this.setData({
          myCountryID: this.data.multiArray[0][this.data.multiIndex[0]].countryID
        })
      }
      await this.getProvinces()
    },
    getProvinces: async function () {
      let result = await reqAlumniAPI(`api/read/local/provinceList/${this.data.myCountryID}`, { limit: 1000 })
      if (!result.status && result.code !== 10005) {
        this.showToast(result.info)
        return
      }

      let entities = []
      if (result.returnData && result.returnData.list) {
        for (let item of result.returnData.list) {
          if (this.data.locale == 'en-US') {
            item.name = item.provinceNameEN
          } else {
            item.name = item.provinceNameCN
          }
          entities.push(item)
        }
      }

      this.data.multiArray[1] = entities
      this.setData({
        multiArray: this.data.multiArray
      })
      if (!this.data.myProvinceID) {
        this.setData({
          myProvinceID: this.data.multiArray[1][this.data.multiIndex[0]].provinceID
        })
      }
      await this.getCities()
    },
    getCities: async function () {
      let result = await reqAlumniAPI(`api/read/local/cityList/${this.data.myProvinceID}`, { limit: 1000 })
      if (!result.status && result.code !== 10005) {
        this.showToast(result.info)
        return
      }

      let entities = []
      if (result.returnData && result.returnData.list) {
        for (let item of result.returnData.list) {
          if (this.data.locale == 'en-US') {
            item.name = item.cityNameEN
          } else {
            item.name = item.cityNameCN
          }
          entities.push(item)
        }
      }
      this.data.multiArray[2] = entities
      this.setData({
        multiArray: this.data.multiArray
      })
    },
    bindMultiPickerChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        multiIndex: e.detail.value
      })

      this.getDisplayText()
      this.triggerEvent('areaSelected', {
        displayText: this.data.myDisplayText,
        cityID: this.data.multiArray[2][this.data.multiIndex[2]].cityID
      })
    },
    bindMultiPickerColumnChange: async function (e) {
      console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
      var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      };
      data.multiIndex[e.detail.column] = e.detail.value;
      switch (e.detail.column) {
        case 0:
          this.setData({
            myCountryID: this.data.multiArray[0][e.detail.value].countryID
          })
          await this.getProvinces()
          data.multiIndex[1] = 0;
          data.multiIndex[2] = 0;
          data.myProvinceID = this.data.multiArray[1][0].provinceID
          this.setData(data);
          await this.getCities()
          break;
        case 1:
          this.setData({
            myProvinceID: this.data.multiArray[1][e.detail.value].provinceID
          })
          await this.getCities()
          data.multiIndex[2] = 0;
          this.setData(data);
          break;
      }

    }
  }
})