import regeneratorRuntime from '../libs/regenerator-runtime/runtime.js'
import {
  wxRequest
} from '../libs/http.js'
import settings from '../settings/index'
import moment from '../libs/moment.min.js'


function checkLogin() {
  let loginFlag = wx.getStorageSync('loginFlag')
  let interval;
  if (loginFlag === true) {
    interval = setInterval(
      () => {
        if (wx.getStorageSync('loginFlag') !== true) {
          clearInterval(interval)
        }
      }, 2000
    )
  }
}

function getSysConfig() {
  let sysConfig = wx.getStorageSync('sys_config')
  console.log('getSysConfig:', sysConfig)
  if (!sysConfig || !sysConfig.opCliId || !sysConfig.cfgId) {
    return {
      opCliId: settings.opCliId,
      cfgId: settings.cfgId
    }
  } else {
    return {
      opCliId: sysConfig.opCliId,
      cfgId: sysConfig.cfgId
    }
  }
}


// 获取提交表单的参数
const apiGetPtk = async function (ptkNum = 'ptk1') {
  let url = settings.server_addr + '/?cmd=apiGetPtk&isAjax=1&1203=111'
  console.log('apiGetPtk-url: ', url)
  let data = `&=&post_data={"ptkName":"${ptkNum}"}`
  console.log('apiGetPtk-data:', data)
  let res = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiGetPtk-res:', res)
  if (res.status == 7) {
    return {
      status: true,
      info: res.info,
      returnData: res.returnData,
      data: res.returnData.ptkValue
    }
  } else {
    return {
      status: false,
      info: res.info
    }
  }
}


// 获取会话ID
const apiGetSysDfvs = async function (cb) {
  let url = settings.server_addr + `/?cmd=apiGetSysDfvs&isAjax=1&1203=111`
  console.log('apiGetSysDfvs-url: ', url)
  let res = await wxRequest(url, {
    hideLoading: true,
    data: ''
  })
  console.log('apiGetSysDfvs-res:', res)

  if (res.status == 7) {
    wx.setStorageSync('sessionId', res.returnData.dfvSid)
    wx.setStorageSync('dfvConfig', res.returnData)
    return {
      status: true,
      info: res.info,
      returnData: res.returnData,
      data: res.returnData.dfvSid
    }
  } else {
    return {
      status: false,
      info: res.info
    }
  }
}


// 第三方桥的获取提交表单的参数
const apiGetBridgePtk = async function (ptkNum = 'ptk1') {
  let url = settings.bridge_addr + '/?cmd=apiGetPtk&isAjax=1'
  console.log('apiGetBridgePtk-url: ', url)
  let data = `&=&post_data={"ptkName":"${ptkNum}"}`
  console.log('apiGetBridgePtk-data:', data)
  let res = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiGetBridgePtk-res:', res)
  if (res.status == 7) {
    return {
      status: true,
      info: res.info,
      returnData: res.returnData,
      data: res.returnData.ptkValue
    }
  } else {
    return {
      status: false,
      info: res.info
    }
  }
}

// 获取第三方桥会话id
const apiGetBridgeDfvs = async function (cb) {
  let ptkResult = await apiGetBridgePtk()
  console.log(ptkResult)
  if (!ptkResult.status) {
    console.log(ptkResult)
    return ptkResult
  }
  let url = settings.bridge_addr + `/?cmd=apiGetSysDfvs&isAjax=1&1203=111&ptk1=${ptkResult.data}`
  console.log('apiGetBridgeDfvs-url: ', url)
  let res = await wxRequest(url, {
    hideLoading: true,
    data: ''
  })
  console.log('apiGetBridgeDfvs-res:', res)

  if (res.status == 7) {
    wx.setStorageSync('thirdSessionid', res.returnData.dfvSid)
    wx.setStorageSync('thirdDfvConfig', res.returnData)
    return {
      status: true,
      info: res.info,
      returnData: res.returnData,
      data: res.returnData.dfvSid
    }
  } else {
    return {
      status: false,
      info: res.info
    }
  }
}


// 获取第三方桥信息
const apiGetBridgeInfo = async function () {
  let ptkResult = await apiGetBridgePtk()
  console.log(ptkResult)
  if (!ptkResult.status) {
    console.log(ptkResult)
    return ptkResult
  }

  let url = settings.bridge_addr + `/?cmd=apiGetBridgeInfo&isAjax=1&1203=111&ptk1=${ptkResult.data}&cfgId=${settings.cfgId}&opCliId=${settings.opCliId}`
  console.log('apiGetBridgeInfo-url: ', url)
  let res = await wxRequest(url, {
    hideLoading: true,
    data: ''
  })
  console.log('apiGetBridgeInfo-res:', res)

  if (res.status == 7) {
    let accessCfg = wx.getStorageSync('accessCfg')
    if(!accessCfg) {
      accessCfg = {}
    }
    accessCfg.tplMsgIdForFormReplyConfirmInWxsp = res.returnData.tplMsgIdForFormReplyConfirmInWxsp
    wx.setStorageSync('accessCfg', accessCfg)
    return {
      status: true,
      info: res.info,
      returnData: res.returnData
    }
  } else {
    return {
      status: false,
      info: res.info
    }
  }
}



// 第三方桥代理接口
const apiBridgeApiProxy = async function (brgSess, luckySession) {
  let proxyBy = encodeURIComponent(settings.server_addr + `/?cmd=apiGetThirdAccessAuthToken&opCliId=${settings.opCliId}&isAjax=1`)
  let url = settings.bridge_addr + `/?cmd=apiBridgeApiProxy&proxyUrl=${proxyBy}&isAjax=1`
  console.log('apiBridgeApiProxy-url:', url)
  let data = `&=&luckySession=${luckySession}&brgSess=${brgSess}&post_data={}`
  // let data = `&=&luckySession=${luckySession}&brgSess=${brgSess}`
  console.log('apiBridgeApiProxy-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiBridgeApiProxy-res:', response)
  if (response.status == 7) {
    return {
      status: true,
      info: response.info,
      returnData: response.returnData
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }
}

// 第三方桥小程序登陆
const apiThirdpartyWxLogin = async function (code) {
  let resDfv = await apiGetSysDfvs()
  if (!resDfv.status) {
    return resDfv
  }
  console.log('luckySession:', resDfv.data)
  let bridgeResult = await apiGetBridgeDfvs()
  console.log('bridgeResult:', bridgeResult)
  console.log('brgSess:', bridgeResult.data)
  if (!bridgeResult.status) {
    return bridgeResult
  }

  let ptkResult = await apiGetBridgePtk()
  if (!ptkResult.status) {
    return ptkResult
  }

  let url = settings.bridge_addr + `/?cmd=apiGetCmThirdAccessWxSpUserLoginInfo&opCliId=${settings.opCliId}&isAjax=1&ptk1=${ptkResult.data}`
  console.log('apiThirdpartyWxLogin-url: ', url)

  let data = `&=&post_data=${JSON.stringify({ code: code, cfgId: settings.cfgId })}&brgSess=${bridgeResult.data}`
  console.log('apiThirdpartyWxLogin-data:', data)
  let res = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiThirdpartyWxLogin-res:', res)
  if (res.status != 7) {
    return {
      status: false,
      info: res.info
    }
  }
  console.log('res:', res)
  let result = await apiBridgeApiProxy(bridgeResult.data, resDfv.data)
  if (!result.status) {
    return {
      status: false,
      info: result.info
    }
  }

  let confirmResult = await apiConfirmThirdAccessAuth(result.returnData.tokenId)
  if (!result.status) {
    return {
      status: false,
      info: result.info
    }
  } else {
    // console.log('12121212 ----------')
    // let userInfoResult = await apiGetCurrThirdUserInfo()
    // console.log(userInfoResult)
    return {
      status: true,
      info: confirmResult.info,
      returnData: confirmResult.returnData
    }
  }

}

// 小程序登陆
const apiGetThirdAccessWxSpUserLoginInfo = async function (code) {
  let sysConfig = getSysConfig()
  console.log('sysConfig:', sysConfig)
  let sidRes = await apiGetSysDfvs()

  console.log(sidRes)
  if (!sidRes.status) {
    return sidRes
  }
  console.log('apiGetThirdAccess-sid:', sidRes.data)

  let ptkRes = await apiGetPtk()
  console.log(ptkRes)
  if (!ptkRes.status) {
    return ptkRes
  }
  console.log('apiGetThirdAccess-ptk:', ptkRes.data)
  let url = settings.server_addr + `/?cmd=apiGetThirdAccessWxSpUserLoginInfo&isAjax=1&1203=111&opCliId=${sysConfig.opCliId}&ptk1=${ptkRes.data}`
  console.log('apiGetThirdAccess-url:', url)
  let data = `&=&post_data={"code": "${code}", "cfgId": "${sysConfig.cfgId}"}&luckySession=${sidRes.data}`
  console.log('apiGetThirdAccess-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiGetThirdAccess-res:', response)
  if (response.status == 7) {
    return {
      status: true,
      data: response.data,
      info: response.info,
      returnData: response.returnData
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }
}

// 第三方接入小程序登陆确认
const apiConfirmThirdAccessAuth = async function (tokenId) {
  console.log('tokenId:', tokenId)
  let sysConfig = getSysConfig()
  let luckySession = wx.getStorageSync('sessionId')
  let dfvConfig = wx.getStorageSync('dfvConfig')
  let url = settings.server_addr + `/?cmd=apiConfirmThirdAccessAuth&isAjax=1&1203=111&opCliId=${sysConfig.opCliId}`
  console.log('apiConfirmThirdAccessAuth-url:', url)
  let data = `&=&post_data={"tokenId": "${tokenId}", "tokenApiConfirmThirdAccessAuth": "${dfvConfig.dfvTokenApiConfirmThirdAccessAuth}", "cfgId": "${sysConfig.cfgId}"}&luckySession=${luckySession}`
  console.log('apiConfirmThirdAccessAuth-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiConfirmThirdAccessAuth-res:', response)
  if (response.status == 7) {
    return {
      status: true,
      data: response.data,
      info: response.info,
      returnData: response.returnData
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }
}


// 搜索活动
const apiSearchActvt = async function (pageArgs) {
  let sysConfig = getSysConfig()
  let dCities = ["2", "25", "27", "32", "33", "34", "35"]
  let sid = wx.getStorageSync('sessionId')
  console.log('apiSearchActvt-sid:', sid)
  let ptkRes = await apiGetPtk()
  if (!ptkRes.status) {
    return ptkRes
  }
  console.log('apiSearchActvt-ptk:', ptkRes.data)

  let url = settings.server_addr + `/?cmd=apiSearchActvt&opCliId=${sysConfig.opCliId}&isAjax=1&ptk1=${ptkRes.data}&1203=111`
  console.log('apiSearchActvt-url: ', url)
  let params = { ...pageArgs, pubStatus: [1], pubInWxSp: [1] }
  if (pageArgs.actvtLocations && pageArgs.actvtLocations.length !== 0 && !dCities.includes(pageArgs.actvtLocations[0])) {
    let cityRes = await apiSearchCityByRegion({ parentIds: pageArgs.actvtLocations })
    if (cityRes.status) {
      let cityids = []
      for (let item of cityRes.returnData.datas) {
        cityids.push(item.cityId)
      }
      params['actvtLocations'] = cityids
    }
  }

  let data = `&=&post_data=${JSON.stringify(params)}&luckySession=${sid}`
  console.log('apiSearchActvt-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiSearchActvt-res:', response)
  if (response.status == 7) {
    return {
      status: true,
      info: response.info,
      returnData: response.returnData
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }
}


// 获取置顶的活动
const apiGetTopActvt = async function (locale) {

  let sysConfig = getSysConfig()
  let sid = wx.getStorageSync('sessionId')
  console.log('apiGetTopActvt-sid:', sid)
  let ptkRes = await apiGetPtk()
  if (!ptkRes.status) {
    return ptkRes
  }
  console.log('apiGetTopActvt-ptk:', ptkRes.data)

  let url = settings.server_addr + `/?cmd=apiSearchActvt&opCliId=${sysConfig.opCliId}&isAjax=1&ptk1=${ptkRes.data}&1203=111`
  console.log('apiGetTopActvt-url: ', url)
  let params = { pagenum: 1, perpage: 20, sortCase: 1, languageTypes: locale, pubStatus: [1], pubInWxSp: [1] }
  let data = `&=&post_data=${JSON.stringify(params)}&luckySession=${sid}`
  console.log('apiGetTopActvt-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiGetTopActvt-res:', response)
  if (response.status == 7) {

    let data = []
    for (let item of response.returnData.actvts) {
      if (item.topFlag === '9') {
        data.push(item)
      }
    }
    console.log('top:', data)
    return {
      status: true,
      info: response.info,
      returnData: data
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }
}


// 根据ID获取活动
const apiGetActivity = async function (actvtId) {
  let sysConfig = getSysConfig()
  let sid = wx.getStorageSync('sessionId')
  console.log('apiGetActivity-sid:', sid)
  let ptkRes = await apiGetPtk()
  if (!ptkRes.status) {
    return ptkRes
  }
  console.log('apiGetActivity-ptk:', ptkRes.data)

  let url = settings.server_addr + `/?cmd=apiSearchActvt&opCliId=${sysConfig.opCliId}&isAjax=1&ptk1=${ptkRes.data}&1203=111`
  console.log('apiGetActivity-url: ', url)
  let params = {
    actvtIds: [actvtId],
    needTrackActvtAccess: true
  }
  let data = `&=&post_data=${JSON.stringify(params)}&luckySession=${sid}`
  console.log('apiGetActivity-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiGetActivity-res:', response)
  if (response.status == 7 && response.returnData.actvts && response.returnData.actvts.length != 0) {
    return {
      status: true,
      data: response.returnData.actvts[0],
      returnData: response.returnData,
      info: response.info
    }
  } else if (response.status == 7 && response.returnData.actvts && response.returnData.actvts.length == 0) {
    return {
      status: false,
      info: '该活动不存在'
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }
}


// 搜索城市
const apiSearchCity = async function (pageArgs) {
  let sid = wx.getStorageSync('sessionId')
  console.log('apiSearchCity-sid:', sid)
  let ptkRes = await apiGetPtk()
  if (!ptkRes.status) {
    return ptkRes
  }
  console.log('apiSearchCity-ptk:', ptkRes.data)

  let url = settings.server_addr + `/?cmd=apiSearchCity&isAjax=1&ptk1=${ptkRes.data}&1203=111`
  console.log('apiSearchCity-url: ', url)
  let data = `&=&post_data={"ptkName":"ptk1"}&luckySession=${sid}`
  console.log('apiSearchCity-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiSearchCity-res:', response)
  if (response.status == 7) {
    return {
      status: true,
      info: response.info,
      returnData: response.returnData
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }
}


// 搜索省市
const apiSearchCityByRegion = async function (pageArgs) {
  let sid = wx.getStorageSync('sessionId')
  console.log('apiSearchCityByRegion-sid:', sid)
  let ptkRes = await apiGetPtk()
  if (!ptkRes.status) {
    return ptkRes
  }
  console.log('apiSearchCityByRegion-ptk:', ptkRes.data)

  let url = settings.server_addr + `/?cmd=apiSearchCityByRegion&isAjax=1&ptk1=${ptkRes.data}&1203=111`
  console.log('apiSearchCityByRegion-url: ', url)
  let params = { "ptkName": "ptk1", ...pageArgs }
  let data = `&=&post_data=${JSON.stringify(params)}&luckySession=${sid}`
  console.log('apiSearchCityByRegion-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiSearchCityByRegion-res:', response)
  if (response.status == 7) {
    return {
      status: true,
      info: response.info,
      returnData: response.returnData
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }
}




// 获取所有活动分组
const apiGetAllActvtGroupInfo = async function (pageArgs) {
  let sysConfig = getSysConfig()
  let sid = wx.getStorageSync('sessionId')
  console.log('apiGetAllActvtGroupInfo-sid:', sid)
  let ptkRes = await apiGetPtk()
  if (!ptkRes.status) {
    return ptkRes
  }
  console.log('apiGetAllActvtGroupInfo-ptk:', ptkRes.data)

  let url = settings.server_addr + `/?cmd=apiGetAllActvtGroupInfo&isAjax=1&opCliId=${sysConfig.opCliId}&ptk1=${ptkRes.data}&1203=111`
  console.log('apiGetAllActvtGroupInfo-url: ', url)
  let params = { "ptkName": "ptk1", ...pageArgs }
  let data = `&=&post_data=${JSON.stringify(params)}&luckySession=${sid}`
  console.log('apiGetAllActvtGroupInfo-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiGetAllActvtGroupInfo-res:', response)
  if (response.status == 7) {
    return {
      status: true,
      info: response.info,
      returnData: response.returnData
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }
}




// 获取活动表单
const apiSearchForm = async function (formId) {
  let sysConfig = getSysConfig()
  let sid = wx.getStorageSync('sessionId')
  console.log('apiSearchForm-sid:', sid)
  let ptkRes = await apiGetPtk()
  if (!ptkRes.status) {
    return ptkRes
  }
  console.log('apiSearchForm-ptk:', ptkRes.data)

  let url = settings.server_addr + `/?cmd=apiSearchForm&isAjax=1&opCliId=${sysConfig.opCliId}&ptk1=${ptkRes.data}&1203=111`
  console.log('apiSearchForm-url: ', url)
  let params = { "formIds": [formId], 'needTrackFormAccess': true }
  let data = `&=&post_data=${JSON.stringify(params)}&luckySession=${sid}`
  console.log('apiSearchForm-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiSearchForm-res:', response)
  if (response.status == 7 && response.returnData.forms && response.returnData.forms.length == 1) {
    return {
      status: true,
      info: response.info,
      data: response.returnData.forms[0],
      returnData: response.returnData
    }
  } else if (response.status == 7 && response.returnData.forms && response.returnData.forms.length == 0) {
    return {
      status: false,
      info: '未找到该表单'
    }

  } else {
    return {
      status: false,
      info: response.info
    }
  }
}




// 提交活动表单
const apiSubmitFormData = async function (params) {
  let sysConfig = getSysConfig()
  let sid = wx.getStorageSync('sessionId')
  console.log('apiSubmitFormData-sid:', sid)
  let ptkRes = await apiGetPtk()
  if (!ptkRes.status) {
    return ptkRes
  }
  console.log('apiSubmitFormData-ptk:', ptkRes.data)

  let url = settings.server_addr + `/?cmd=apiSubmitFormData&isAjax=1&opCliId=${sysConfig.opCliId}&ptk1=${ptkRes.data}&1203=111`
  console.log('apiSubmitFormData-url: ', url)
  let data = `&=&post_data=${JSON.stringify(params)}&luckySession=${sid}`
  console.log('apiSubmitFormData-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiSubmitFormData-res:', response)
  if (response.status == 7) {
    return {
      status: true,
      info: response.info,
      returnData: response.returnData
    }

  } else {
    return {
      status: false,
      info: response.info
    }
  }
}

// ?cmd=apiOssGetUploadTempFileCertificate&opCliId=xxx&isAjax=1


// 提交活动表单
// apiOssGetUploadTempFileCertificate
const apiGetUploadCert = async function () {

  let ossConfig = wx.getStorageSync('ossConfig')
  if (ossConfig) {
    if (moment().subtract(1, 'hours') < moment(ossConfig.timestamp)) {
      return {
        status: true,
        data: ossConfig.config
      }
    } else {
      wx.removeStorageSync('ossConfig')
    }
  }

  let token;
  let dfvConfig = wx.getStorageSync('dfvConfig')
  if (dfvConfig && dfvConfig.dfvTokenApiOssGetUploadTempFileCertificate) {
    token = dfvConfig.dfvTokenApiOssGetUploadTempFileCertificate
  } else {
    return {
      status: false,
      info: 'dfvConfig不存在'
    }
  }

  let sysConfig = getSysConfig()
  let sid = wx.getStorageSync('sessionId')
  console.log('apiGetUploadCert-sid:', sid)
  let ptkRes = await apiGetPtk('ptk3')
  if (!ptkRes.status) {
    return ptkRes
  }
  console.log('apiGetUploadCert-ptk:', ptkRes.data)

  let url = settings.server_addr + `/?cmd=apiOssGetUploadTempFileCertificate&isAjax=1&opCliId=${sysConfig.opCliId}&ptk3=${ptkRes.data}&1203=111`
  console.log('apiGetUploadCert-url: ', url)
  let data = `&=&post_data={"tokenApiOssGetUploadTempFileCertificate":"${token}"}&luckySession=${sid}`
  console.log('apiGetUploadCert-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiGetUploadCert-res:', response)
  if (response.status == 7) {
    wx.setStorageSync('ossConfig', {
      'timestamp': moment().format('YYYYMMDDHHmmss'),
      'config': response
    })
    return {
      status: true,
      info: response.info,
      returnData: response.returnData
    }

  } else {
    return {
      status: false,
      info: response.info
    }
  }
}

// 获取用户提交的表单
const apiSearchUserFormSubmitFootmark = async function () {
  let sysConfig = getSysConfig()
  let sid = wx.getStorageSync('sessionId')
  console.log('apiSearchUserFormSubmitFootmark-sid:', sid)
  let ptkRes = await apiGetPtk()
  if (!ptkRes.status) {
    return ptkRes
  }
  console.log('apiSearchUserFormSubmitFootmark-ptk:', ptkRes.data)

  let url = settings.server_addr + `/?cmd=apiSearchUserFormSubmitFootmark&isAjax=1&opCliId=${sysConfig.opCliId}&ptk1=${ptkRes.data}&1203=111`
  console.log('apiSearchUserFormSubmitFootmark-url: ', url)
  let params = {}
  let data = `&=&post_data=${JSON.stringify(params)}&luckySession=${sid}`
  console.log('apiSearchUserFormSubmitFootmark-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiSearchUserFormSubmitFootmark-res:', response)
  if (response.status == 7) {
    return {
      status: true,
      info: response.info,
      returnData: response.returnData
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }
}


// 获取表单反馈数据
const apiSearchFormReplyStatistics = async function (params) {
  let sysConfig = getSysConfig()
  let sid = wx.getStorageSync('sessionId')
  console.log('apiSearchFormReplyStatistics-sid:', sid)
  let ptkRes = await apiGetPtk()
  if (!ptkRes.status) {
    return ptkRes
  }
  console.log('apiSearchFormReplyStatistics-ptk:', ptkRes.data)

  let url = settings.server_addr + `/?cmd=apiSearchFormReplyStatistics&isAjax=1&opCliId=${sysConfig.opCliId}&ptk1=${ptkRes.data}&1203=111`
  console.log('apiSearchFormReplyStatistics-url: ', url)
  // let params = { "formId": formId }
  let data = `&=&post_data=${JSON.stringify(params)}&luckySession=${sid}`
  console.log('apiSearchFormReplyStatistics-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiSearchFormReplyStatistics-res:', response)
  if (response.status == 7 && response.returnData.forms && response.returnData.forms.length == 1) {
    return {
      status: true,
      info: response.info,
      returnData: response.returnData
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }
}


const apiSearchFormRegister = async function (params) {
  let sysConfig = getSysConfig()
  let sid = wx.getStorageSync('sessionId')
  console.log('apiSearchFormRegister-sid:', sid)
  let ptkRes = await apiGetPtk()
  if (!ptkRes.status) {
    return ptkRes
  }
  console.log('apiSearchFormRegister-ptk:', ptkRes.data)

  let url = settings.server_addr + `/?cmd=apiSearchFormRegister&isAjax=1&opCliId=${sysConfig.opCliId}&ptk1=${ptkRes.data}&1203=111`
  console.log('apiSearchFormRegister-url: ', url)
  // let params = { "formId": formId }
  let data = `&=&post_data=${JSON.stringify(params)}&luckySession=${sid}`
  console.log('apiSearchFormRegister-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiSearchFormRegister-res:', response)
  if (response.status == 7) {
    return {
      status: true,
      info: response.info,
      returnData: response.returnData
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }
}


const apiSearchFormValidDataDate = async function (params) {
  let sysConfig = getSysConfig()
  let sid = wx.getStorageSync('sessionId')
  console.log('apiSearchFormValidDataDate-sid:', sid)
  let ptkRes = await apiGetPtk()
  if (!ptkRes.status) {
    return ptkRes
  }
  console.log('apiSearchFormValidDataDate-ptk:', ptkRes.data)

  let url = settings.server_addr + `/?cmd=apiSearchFormValidDataDate&isAjax=1&opCliId=${sysConfig.opCliId}&ptk1=${ptkRes.data}&1203=111`
  console.log('apiSearchFormValidDataDate-url: ', url)
  let data = `&=&post_data=${JSON.stringify(params)}&luckySession=${sid}`
  console.log('apiSearchFormValidDataDate-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiSearchFormValidDataDate-res:', response)
  if (response.status == 7) {
    return {
      status: true,
      info: response.info,
      returnData: response.returnData
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }
}


const apiSearchUserFormData = async function (params) {
  let sysConfig = getSysConfig()
  let sid = wx.getStorageSync('sessionId')
  console.log('apiSearchUserFormData-sid:', sid)
  let ptkRes = await apiGetPtk()
  if (!ptkRes.status) {
    return ptkRes
  }
  console.log('apiSearchUserFormData-ptk:', ptkRes.data)

  let url = settings.server_addr + `/?cmd=apiSearchUserFormData&isAjax=1&opCliId=${sysConfig.opCliId}&ptk1=${ptkRes.data}&1203=111`
  console.log('apiSearchUserFormData-url: ', url)
  let data = `&=&post_data=${JSON.stringify(params)}&luckySession=${sid}`
  console.log('apiSearchUserFormData-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiSearchUserFormData-res:', response)
  if (response.status == 7) {
    return {
      status: true,
      info: response.info,
      returnData: response.returnData
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }
}

// 搜索用户最后一次提交指定表单
const apiSearchUserLastSubmitForm = async function (params) {
  let sysConfig = getSysConfig()
  let sid = wx.getStorageSync('sessionId')
  let ptkRes = await apiGetPtk()
  if (!ptkRes.status) {
    return ptkRes
  }
  console.log('apiSearchUserLastSubmitForm-ptk:', ptkRes.data)
  let url = settings.server_addr + `/?cmd=apiSearchUserLastSubmitForm&isAjax=1&opCliId=${sysConfig.opCliId}&ptk1=${ptkRes.data}&1203=111`
  console.log('apiSearchUserLastSubmitForm-url: ', url)
  let data = `&=&post_data=${JSON.stringify(params)}&luckySession=${sid}`
  console.log('apiSearchUserLastSubmitForm-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiSearchUserLastSubmitForm-res:', response)
  if (response.status == 7) {
    return {
      status: true,
      info: response.info,
      returnData: response.returnData
    }
  } else {
    let res = {
      status: false,
      info: response.info
    }
    if(response && response.returnData && response.returnData.errorCode) {
      res.errorCode = response.returnData.errorCode
    }
    return res
  }
}


const apiSearchThirdAccessCfg = async function () {
  let sysConfig = getSysConfig()
  let ptkRes = await apiGetPtk()
  if (!ptkRes.status) {
    return ptkRes
  }
  console.log('apiSearchThirdAccessCfg-ptk:', ptkRes.data)

  let url = settings.server_addr + `/?cmd=apiSearchThirdAccessCfg&isAjax=1&opCliId=${sysConfig.opCliId}&ptk1=${ptkRes.data}&1203=111`
  console.log('apiSearchThirdAccessCfg-url: ', url)
  let params = { "detailFlag": false }
  let data = `&=&post_data=${JSON.stringify(params)}`
  console.log('apiSearchThirdAccessCfg-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiSearchThirdAccessCfg-res:', response)
  response.returnData.cfgs.map((item) => {
    
    if(item.cfgId == settings.cfgId) {
      console.log('find item:' , item)
      wx.setStorageSync('accessCfg', item)
    }
  })
  
  if (response.status == 7) {
    return {
      status: true,
      info: response.info,
      return: response.returnData
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }
}





// 获取支付参数
const apiWxSpStartPayThroughBridge = async function (params) {
  let sysConfig = getSysConfig()
  let sid = wx.getStorageSync('sessionId')
  let ptkRes = await apiGetBridgePtk()
  if (!ptkRes.status) {
    return ptkRes
  }
  console.log('apiWxSpStartPayThroughBridge-ptk:', ptkRes.data)
  
  let thirdSessionid = wx.getStorageSync('thirdSessionid')

  let url = `${settings.bridge_pay_addr}/?cmd=apiWxSpStartPayThroughBridge&isAjax=1&opCliId=${sysConfig.opCliId}&cfgId=${settings.cfgId}&orderId=${params.orderId}&payCase=${params.payCase}&ptk1=${ptkRes.data}&1203=111`

  console.log('apiWxSpStartPayThroughBridge-url: ', url)
  let data = `&=&post_data={}&brgSess=${thirdSessionid}&luckySession=${sid}`
  console.log('apiWxSpStartPayThroughBridge-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiWxSpStartPayThroughBridge-res:', response)
  if (response.status == 7) {
    return {
      status: true,
      info: response.info,
      returnData: response.returnData
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }
}


const apiGetCurrThirdUserInfo = async function() {
  let sysConfig = getSysConfig()
  let sid = wx.getStorageSync('sessionId')
  let ptkRes = await apiGetBridgePtk()
  if (!ptkRes.status) {
    return ptkRes
  }
  console.log('apiGetCurrThirdUserInfo-ptk:', ptkRes.data)

  let url = `${settings.server_addr}/?cmd=apiGetCurrThirdUserInfo&isAjax=1&opCliId=${sysConfig.opCliId}&ptk1=${ptkRes.data}&1203=111`
  console.log('apiGetCurrThirdUserInfo-url: ', url)
  let data = `&=&post_data={}&luckySession=${sid}`
  console.log('apiGetCurrThirdUserInfo-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiGetCurrThirdUserInfo-res:', response)
  if (response.status == 7) {
    return {
      status: true,
      info: response.info,
      returnData: response.returnData
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }

}


const apiGetThirdUserAuthUrlWithSessionInfo = async function (scrmThirdUserAuthRetUrl) {
  let sysConfig = getSysConfig()
  let sid = wx.getStorageSync('sessionId')

  let url = settings.server_addr + `/?cmd=apiGetThirdUserAuthUrlWithSessionInfo&isAjax=1&opCliId=${sysConfig.opCliId}&cfgId=${sysConfig.cfgId}&scrmThirdUserAuthRetUrl=${scrmThirdUserAuthRetUrl}&1203=111`
  console.log('apiGetThirdUserAuthUrlWithSessionInfo-url: ', url)
  let data = `&=&post_data={}&luckySession=${sid}`
  console.log('apiGetThirdUserAuthUrlWithSessionInfo-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiGetThirdUserAuthUrlWithSessionInfo-res:', response)
  if (response.status == 7) {
    return {
      status: true,
      info: response.info,
      returnData: response.returnData
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }

}

const apiSendWxspSubscribeMsg = async function (params) {
  let sysConfig = getSysConfig()
  let sid = wx.getStorageSync('sessionId')

  let url = settings.server_addr + `/?cmd=apiSendWxspSubscribeMsg&isAjax=1&opCliId=${sysConfig.opCliId}&cfgId=${sysConfig.cfgId}&1203=111`
  console.log('apiGetThirdUserAuthUrlWithSessionInfo-url: ', url)
  let data = `&=&post_data=${JSON.stringify(params)}&luckySession=${sid}`
  console.log('apiSendWxspSubscribeMsg-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiSendWxspSubscribeMsg-res:', response)
  if (response.status == 7) {
    return {
      status: true,
      info: response.info,
      returnData: response.returnData
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }

}

const apiSearchShortCode = async function (codeIds, isBridge = false) {
  let sid = wx.getStorageSync('sessionId')
  let sysConfig = getSysConfig()
  let url = settings.server_addr + `/?cmd=apiSearchShortCode&isAjax=1`
  if(isBridge) {
    url = settings.bridge_addr + `/?cmd=apiSearchShortCode&isAjax=1`
  }

  console.log('apiSearchShortCode-url: ', url)
  let data = `&=&post_data=${JSON.stringify({codeIds: codeIds})}&luckySession=${sid}`
  console.log('apiSearchShortCode-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiSearchShortCode-res:', response)
  if (response.status == 7) {
    return {
      status: true,
      info: response.info,
      returnData: response.returnData
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }
}

// 获取所有文章分组信息
const apiGetAllArtcGroupInfo = async function (onlyCanDisplayInAdmin) {
  let sid = wx.getStorageSync('sessionId')
  let sysConfig = getSysConfig()
  let url = settings.server_addr + `/?cmd=apiGetAllArtcGroupInfo&opCliId=${sysConfig.opCliId}&isAjax=1`
  let data;
  console.log('apiGetAllArtcGroupInfo-url: ', url)
  if(onlyCanDisplayInAdmin !== undefined) {
    data = `&=&post_data=${JSON.stringify({onlyCanDisplayInAdmin: onlyCanDisplayInAdmin})}&luckySession=${sid}`
  } else {
    data = `&=&post_data=${JSON.stringify({})}&luckySession=${sid}`
  }

  console.log('apiGetAllArtcGroupInfo-data:', data)
  let response = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('apiGetAllArtcGroupInfo-res:', response)
  if (response.status == 7) {
    return {
      status: true,
      info: response.info,
      returnData: response.returnData
    }
  } else {
    return {
      status: false,
      info: response.info
    }
  }
}


// 搜索文章
const apiSearchArtc = async function (pageArgs) {
    let sysConfig = getSysConfig()
    let sid = wx.getStorageSync('sessionId')
    console.log('apiSearchArtc-sid:', sid)
    let ptkRes = await apiGetPtk()
    if (!ptkRes.status) {
      return ptkRes
    }
    console.log('apiSearchArtc-ptk:', ptkRes.data)
  
    let url = settings.server_addr + `/?cmd=apiSearchArtc&opCliId=${sysConfig.opCliId}&isAjax=1&ptk1=${ptkRes.data}&1203=111`
    console.log('apiSearchArtc-url: ', url)
    let params = { ...pageArgs, pubStatus: [1], pubInWxSp: [1] }
  
    let data = `&=&post_data=${JSON.stringify(params)}&luckySession=${sid}`
    console.log('apiSearchArtc-data:', data)
    let response = await wxRequest(url, {
      hideLoading: true,
      data: data
    })
    console.log('apiSearchArtc-res:', response)
    if (response.status == 7) {
      return {
        status: true,
        info: response.info,
        returnData: response.returnData
      }
    } else {
      return {
        status: false,
        info: response.info
      }
    }
  }
  

export {
  apiGetPtk,
  apiGetSysDfvs,
  apiGetThirdAccessWxSpUserLoginInfo,
  apiConfirmThirdAccessAuth,
  apiSearchActvt,
  apiGetTopActvt,
  apiSearchCity,
  apiSearchCityByRegion,
  apiGetAllActvtGroupInfo,
  apiGetActivity,
  apiSearchForm,
  apiSubmitFormData,
  apiGetUploadCert,
  apiSearchFormReplyStatistics,
  apiSearchFormRegister,
  apiSearchFormValidDataDate,
  apiSearchUserFormSubmitFootmark,
  apiSearchUserFormData,
  apiSearchThirdAccessCfg,
  apiGetBridgeDfvs,
  apiGetBridgeInfo,
  apiThirdpartyWxLogin,
  apiSearchUserLastSubmitForm,
  apiWxSpStartPayThroughBridge,
  apiGetCurrThirdUserInfo,
  apiGetThirdUserAuthUrlWithSessionInfo,
  apiSendWxspSubscribeMsg,
  apiSearchShortCode,
  apiSearchArtc,
  apiGetAllArtcGroupInfo,
  getSysConfig
}