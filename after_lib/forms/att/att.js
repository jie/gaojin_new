import regeneratorRuntime from '../../../libs/regenerator-runtime/runtime'
import AfformBehaviors from '../afform_behaviors.js'
import uploadFile from '../../../libs/aliyun_oss/uploadAliyun'
import { UUID } from '../../../libs/uuid'
import moment from '../../../libs/moment.min.js'


import {
  apiGetUploadCert,
  getSysConfig
} from '../../api'

const oss1 = require('../../../libs/oss.js')

Component({
  behaviors: [AfformBehaviors],
  properties: {
    fileType: {
      type: Array,
      value: []
    },
    numLimit: {
      type: Number,
      value: 1
    },
    limitAmount: {
      type: Number,
      value: 20 * 1024
    }
  },
  data: {
    support_file_types: '',
    dataField: "uploadFiles",
    uploadStatus: 0,
    uploadExtName: '',
    uploadFiles: []
  },

  attached: function() {
    this.updateSupportFileType()
  },
  ready() {
    if (this.data.initValue) {
      console.log('- ---- --- att --- -- - -- ')
      console.log(this.data.initValue)
      let uploadFiles = []
      for(let item of this.data.initValue) {
        uploadFiles.push(JSON.parse(item.dataValue))
      }
      this.setData({
        uploadFiles: uploadFiles
      })
    }
  },
  methods: {
    updateSupportFileType: function() {
      let support_file_types = ''
      if(this.data.fileType && this.data.fileType.length!==0) {
        support_file_types = this.data.fileType.join(', ')
      }

      this.setData({
        support_file_types: support_file_types
      })
    },
    ontapUpload: function() {
      let that = this
      wx.chooseImage({
        count: this.data.numLimit,
        sourceType: ['album', 'camera'],
        success: (res)=>{
          console.log(res)
          that.uploadFile({
            actionType: 'AF_FORM_ATT_UPLOAD',
            data: res
           })
          return
        },
        fail: (err) => {
          console.log(err)
        },
        complete: ()=>{

        }
      })
    },
    _getExtName: function (filename) {
      let nameList = filename.split('.')
      return nameList[nameList.length - 1]
    },
    uploadFile: async function (options) {
      console.log(options)
      let sysconfig = getSysConfig()
      let dfvConfig = wx.getStorageSync('dfvConfig')
      let result = await apiGetUploadCert(dfvConfig.dfvTokenApiOssGetUploadTempFileCertificate)
      let ossConfig = result.returnData.ossReturn.data
      let dateObj = moment(result.returnData.date)
      let cliDate = moment(result.returnData.cliDate)
      let myUUID = new UUID();
      let that = this;
      let extName = this._getExtName(options.data.tempFilePaths[0])
      let fileName = `${myUUID.id}.${extName}`.toLocaleLowerCase()
      let uploadTime = result.returnData.time
      let ossdir = `wrDir/public/mdapp/nosync/temp/${dateObj.format('YYYYMM')}/${dateObj.format('DD')}/${cliDate.format('YYYYMM')}/${cliDate.format('DD')}/${sysconfig.opCliId}/${fileName}`
      console.log('ossdir:', ossdir)
      console.log('ossConfig:', ossConfig)
      console.log('dfvConfig:', dfvConfig)
      let uploadUrl = dfvConfig.dfvTempExternalEndpointUrl.replace('http', 'https')
      console.log('uploadUrl:', uploadUrl)
      let ossObj = oss1.util.aliOssParams(
        ossConfig.AccessKeyId,
        ossConfig.AccessKeySecret,
        uploadUrl,
        ossConfig.Expiration
      )
      console.log('ossObj.host:', ossObj.host)
      wx.uploadFile({
        url: ossObj.host,
        filePath: options.data.tempFilePaths[0],
        name: 'file',
        formData: {
          name: options.data.tempFilePaths[0],
          key: ossdir,
          policy: ossObj.policy,
          OSSAccessKeyId: ossConfig.AccessKeyId,
          success_action_status: 200,
          signature: ossObj.signature,
          'x-oss-security-token': ossConfig.SecurityToken
        },
        success: async function (res) {
          that.data.uploadFiles = [{
            fileName: fileName,
            uploadTime: uploadTime
          }]
          that.triggerEvent("action", {
            actionType: 'AF_FORM_ATT_UPLOAD_SUCCESS',
            value: that.data.uploadFiles,
            cpntId: that.data.cpntId,
            dataField: that.data.dataField
          })
          that.setData({
            uploadStatus: 1,
            uploadExtName: extName,
            uploadFiles: that.data.uploadFiles,
            _val: fileName,
            err: ''
          })
        },
        fail: function (err) {
          console.error(err)
          that.triggerEvent("action", {
            actionType: 'AF_FORM_ATT_UPLOAD_FAIL'
          });
          that.setData({
            uploadStatus: 0,
            uploadExtName: ''
          })
        }
      })
    }
  }
})
