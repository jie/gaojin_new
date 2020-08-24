import regeneratorRuntime from '../../../libs/regenerator-runtime/runtime'
import moment from '../../../libs/moment.min.js'
import { reqAlumniAPI, reqDevelopAPI } from '../../api'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dynamic: {
      type: Object
    },
    locale: {
      type: String,
      value: "zh-CN"
    },
    localeImage: {
      type: String,
      value: '../../../assets/icons/location.png'
    },
    noUserImage: {
      type: String,
      value: '../../../assets/icons/no_user.png'
    },
    sendImage: {
      type: String,
      value: '../../../assets/icons/send.png'
    },
    zanImage: {
      type: String,
      value: '../../../assets/icons/zan.png'
    },
    zanImageSelected: {
      type: String,
      value: '../../../assets/icons/zan-filled.png'
    },
    commentImage: {
      type: String,
      value: "../../../assets/icons/comment-dark.png"
    },
    baseurl: {
      type: String
    },
    imageStyle: {
      type: Object,
      value: {}
    }
  },
  data: {
    avatar: null,
    sendTo: 'Send to ',
    isShowSender: false,
    replyCommentID: null,
    commentContent: '',
    zanCollections: [],
    zanStorageKey: 'zan_collections',
  },
  attached() {
    this.updateEntity()
  },
  methods: {
    parseJson: function(data) {
      try {
        return JSON.parse(data)
      } catch(e) {
        return data
      }
    },
    updateComments: function(dynamic) {
      if (dynamic.comments && dynamic.comments.length != 0) {
        let comments = []
        for (let comment of dynamic.comments) {
          var originIndex = null;
          if (comment.replyCommentID !== '0') {
            originIndex = this.getReplyTargetIndex(comment.replyCommentID)
            if (originIndex !== null) {
              comment.originIndex = originIndex
            }
          }
          comment.commentContent = this.parseJson(comment.commentContent)
          comments.push(comment)
        }
        this.setData({
          'entity.comments': comments
        })
      }

    },
    updateEntity: function () {
      let entity = this.data.dynamic
      entity.createDate = moment(entity.createDate).fromNow()
      try {
        entity.dynamicContent = this.parseJson(entity.dynamicContent)
      } catch(e) {
        entity.dynamicContent = entity.dynamicContent
      }
      
      let images = []
      if (entity.images) {
        for (let item of entity.images) {
          if (item) {
            images.push(this.getImageURL(item))
          }
        }
        entity.images = images
      }

      if(entity.comments && entity.comments.length!=0) {
        let comments = []
        
        for(let comment of entity.comments) {
          var originIndex = null;
          if(comment.replyCommentID!=='0') {
            originIndex = this.getReplyTargetIndex(comment.replyCommentID)
            if (originIndex!==null) {
              comment.originIndex = originIndex
            }
          }
          comment.commentContent = this.parseJson(comment.commentContent)
          comments.push(comment)
        }
        entity.comments = comments
      }

      let avatar = this.getAlumniAvatar(entity.alumniImage)
      let url = '/pages/contact_view/contact_view?alumniID=' + entity.alumniID.toString()
      this.setData({
        entity: entity,
        avatar: avatar,
        url: url
      })
    },
    getReplyTargetIndex(commentID) {
      for(let i=0; i< this.data.dynamic.comments.length;i++) {
        if (commentID == this.data.dynamic.comments[i].commentID) {
          return i
        }
      }
      return null
    },

    ontapPicture: function (e) {
      let urls = []
      for (let item of this.data.entity.images) {
        urls.push(item)
      }
      wx.previewImage({
        current: urls[e.target.dataset.index],
        urls: urls
      })
    },
    getAlumniAvatar(avatar) {
      if (!avatar || avatar && avatar.length < 10) {
        return '../../../assets/icons/no_user.png'
      } else if (avatar.includes('wx.qlogo.cn')) {
        return avatar
      } else {
        return `${this.data.baseurl}${avatar}`
      }
    },
    getImageURL(url) {
      if (!url || (url && url.length < 10)) {
        return null
      } else {
        return `${this.data.baseurl}${url}`
      }
    },
    createPraise: async function () {
      let zans = wx.getStorageSync(this.data.zanStorageKey)
      if (!zans) {
        wx.setStorageSync([])
      }
      let result;
      if (!zans.includes(this.data.dynamic.dynamicID)) {
        result = await reqAlumniAPI('api/write/dynamic/spotPraise', {
          dynamicID: this.data.dynamic.dynamicID
        })
        if (!result.status) {
          wx.showToast({
            title: result.info,
            icon: 'none',
            duration: 2000
          })
          return
        }
        zans.push(this.data.dynamic.dynamicID)
        wx.setStorageSync(this.data.zanStorageKey, data)
        this.setData({
          'entity.praiseCount': parseInt(this.data.entity.praiseCount) + 1,
          'entity.praised': true
        })
      } else {
        result = await reqAlumniAPI('api/write/dynamic/spotPraise', {
          dynamicID: this.data.dynamic.dynamicID
        })
        if (!result.status) {
          wx.showToast({
            title: result.info,
            icon: 'none',
            duration: 2000
          })
          return
        }
        zans.push(this.data.dynamic.dynamicID)
        wx.setStorageSync(this.data.zanStorageKey, data)
        this.setData({
          'entity.praiseCount': parseInt(this.data.entity.praiseCount) + 1,
        })
      }
    },
    showCommentBox: function () {

      let replyName;
      if (this.data.locale == 'en-US') {
        replyName = `Comment`
      } else {
        replyName = `评论`
      }
      this.setData({
        isShowSender: true,
        sendToPlaceholder: replyName
      })
    },
    showCommentReplyBox: function (e) {
      let comment = this.data.entity.comments[e.target.dataset.index]
      let replyName;
      if (this.data.locale == 'en-US') {
        replyName = `send to ${comment.alumni.alumniNameEN}`
      } else {
        replyName = `回复${comment.alumni.alumniNameCN}`
      }
      console.log(replyName)
      this.setData({
        replyCommentID: comment.commentID,
        sendToPlaceholder: replyName,
        isShowSender: true
      })
    },
    goAlumniView: function (e) {
      wx.navigateTo({
        url: `/pages/contact_view/contact_view?alumniID=${e.target.dataset.alumniid}`
      })
    },
    onBlurInput: function () {
      this.setData({
        isShowSender: false,
      })
    },
    createComment: async function () {
      if (!this.data.commentContent || this.data.commentContent.length === 0) {
        return
      }

      let loginInfo = wx.getStorageSync('loginInfo')

      let reqData = {
        dynamicID: this.data.dynamic.dynamicID,
        commentContent: this.data.commentContent
      }
      if (this.data.replyCommentID) {
        reqData.replyCommentID = this.data.replyCommentID
      }
      let result = await reqAlumniAPI('api/write/dynamic/createComment', reqData)
      if (!result.status) {
        wx.showToast({
          title: result.info,
          icon: 'none',
          duration: 2000
        })
        return
      }

      let updateResult = await reqDevelopAPI(`api/read/dynamic/dynamicDetail/${this.data.entity.dynamicID}`, {}, false)
      if (!updateResult.status) {
        wx.showToast({
          title: updateResult.info,
          icon: 'none',
          duration: 2000
        })
        return
      }

      this.updateComments(updateResult.returnData)
      wx.showToast({
        title: '',
        icon: 'success',
        duration: 2000
      })
    },
    onInputChange: function (e) {
      this.setData({
        commentContent: e.detail.value
      })
    }
  }
})
