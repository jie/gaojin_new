// campus_lib/components/dynamic_content/dynamic_content.js
import moment from '../../../libs/moment.min.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    member: {
      type: Object
    },
    locale: {
      type: String,
      value: "zh-CN"
    },
    baseurl: {
      type: String
    },
    subTitle: {
      type: String
    },
    avatar: {
      type: String,
      default: ()=>{
        return null
      }
    }
  },
  data: {
    url: ''
  },

  ready() {
    this.updateEntity()
  },
  methods: {
    updateEntity: function () {
      let member = this.data.member
      
      this.setData({
        member: member,
        avatar: this.getAlumniAvatar(member.alumniImage),
        url: `/pages/contact_view/contact_view?alumniID=${member.alumniID}&alumniToken=${member.alumniToken}`
      })
    },
    getAlumniAvatar(avatar) {
      if (!avatar || (avatar && avatar.length < 10)) {
        return './no_user.png'
      } else {
        if (avatar.includes('http')) {
          return avatar
        } else {
          return `${this.data.baseurl}${avatar}`
        }
      }
    },
    goDetail: function() {
      wx.navigateTo({
        url: this.data.url,
      })
    }
  }
})
