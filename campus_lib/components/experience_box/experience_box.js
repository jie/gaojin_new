// campus_lib/components/dynamic_content/dynamic_content.js
import moment from '../../../libs/moment.min.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    entity: {
      type: Object
    },
    locale: {
      type: String,
      value: "zh-CN"
    },
    baseurl: {
      type: String
    },
    url: {
      type: String
    },
    logo: {
      type: String
    },
    boxType: {
      type: String
    },
    campusServerAddr: {
      type: String,
      value: ''
    }
  },
  data: {
    link: '',
    logoUrl: ''
  },

  ready() {
    this.updateEntity()
  },
  methods: {
    updateEntity: function () {
      let entity = this.data.entity
      let logo;
      let link = '';
      if (this.data.boxType == 'education') {
        link = this.data.url || `/pages/university_detail/university_detail?schoolID=${entity.schoolID}`
      }
      if(this.data.boxType == 'education') {
        logo = this.getLogo(entity.schoolLogo)
      } else if(this.data.boxType == 'career') {
        logo = this.getLogo(entity.companyLogo)
      }
      this.setData({
        logoUrl: logo,
        entity: entity,
        link: link
      })
      console.log(this.data.link)
    },
    getLogo(logo) {
      if (!logo || logo && logo.length < 10) {
        return './no_company.png'
      } else {
        return `${this.data.campusServerAddr}${logo}`
      }
    },
    goDetail: function (e) {
      console.log(e)
      wx.navigateTo({
        url: this.data.link,
      })
    }
  }
})
