import regeneratorRuntime from '../libs/regenerator-runtime/runtime.js'
import { wxRequest } from '../libs/http.js'
import { wxUpload } from '../libs/upload.js'
import settings from '../settings/index'
import moment from '../libs/moment.min.js'

function getLocale() {
  let locale = wx.getStorageSync('locale')
  if(!locale) {
    return 'zh-CN'
  } else {
    return locale
  }
}


const requestData = async function (params) {
  let url = `${settings.campusServerAddr}/api/parameter/changeData`
  let res = await wxRequest(url, {
    hideLoading: false,
    data: params
  })

  console.log('requestData-res:', res)
  if (res.errMsg === 'request:ok') {
    return {
      status: true,
      info: 'ok',
      returnData: res.data
    }
  } else {
    return {
      status: false,
      code: res.code,
      info: 'get_data_fail'
    }
  }

}

const uploadFile = async function (params) {
  let loginInfo = checkLogin()

  let url = `${settings.campusServerAddr}/api/write/upload/image`
  console.log('uploadFile-url: ', url)

  let data = { ...params };
  if (!data.alumniID) {
    data.alumniID = loginInfo.alumniID
    data.alumniToken = loginInfo.alumniToken
  }

  console.log('uploadFile-data:', data)
  let res = await wxUpload(url, {
    hideLoading: false,
    data: data,
    filePath: params.filePath,
    name: params.fieldName
  })
  console.log('uploadFile-res:', res)
  let result = JSON.parse(res)
  if (result.code == 200) {
    return {
      status: true,
      info: result.msg,
      returnData: result.data
    }
  } else {
    return {
      status: false,
      code: result.code,
      info: result.msg
    }
  }
}


const uploadFileByDev = async function (params) {
  let url = `${settings.campusServerAddr}/api/write/upload/image`
  console.log('uploadFileByDev-url: ', url)
  let data = { ...params }
  data.developmentKey = settings.campusDevelopmentKey,
  data.developmentSecret = settings.campusDevelopmentSecret,
  console.log('uploadFileByDev-data:', data)
  let res = await wxUpload(url, {
    hideLoading: false,
    data: data,
    filePath: params.filePath,
    name: 'file'
  })
  console.log('uploadFileByDev-res:', res)
  let result = JSON.parse(res)
  if (result.code == 200) {
    return {
      status: true,
      info: result.msg,
      returnData: result.data
    }
  } else {
    return {
      status: false,
      code: result.code,
      info: result.msg
    }
  }
}



const getPlaceCategoryList = async function (schoolID) {
  let url = `${settings.campusServerAddr}/api/read/school/placeCategoryList/${schoolID}`
  console.log('placeCategoryList-url: ', url)
  let data = {
    developmentKey: settings.campusDevelopmentKey,
    developmentSecret: settings.campusDevelopmentSecret,
  }
  console.log('placeCategoryList-data:', data)
  let res = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('placeCategoryList-res:', res)
  if (res.code == 200) {
    return {
      status: true,
      info: res.msg,
      returnData: res.data
    }
  } else {
    return {
      status: false,
      code: res.code,
      info: res.msg
    }
  }
}

const getPlaceDetail = async function (placeID) {
  let url = `${settings.campusServerAddr}/api/read/place/placeDetail/${placeID}`
  console.log('getPlaceDetail-url: ', url)
  let data = {
    developmentKey: settings.campusDevelopmentKey,
    developmentSecret: settings.campusDevelopmentSecret,
  }
  console.log('getPlaceDetail-data:', data)
  let res = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('getPlaceDetail-res:', res)
  if (res.code == 200) {
    return {
      status: true,
      info: res.msg,
      returnData: res.data
    }
  } else {
    return {
      status: false,
      code: res.code,
      info: res.msg
    }
  }
}

const getInfoCategoryList = async function (schoolID, params) {

  let dataResult = await requestData(params)
  if (!dataResult.status) {
    return dataResult
  }

  let url = `${settings.campusServerAddr}/api/read/school/infoCategoryList/${schoolID}`
  console.log('infoCategoryList-url: ', url)
  let data = {
    developmentKey: settings.campusDevelopmentKey,
    developmentSecret: settings.campusDevelopmentSecret,
    data: dataResult.returnData
  }
  console.log('infoCategoryList-data:', data)
  let res = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('infoCategoryList-res:', res)
  if (res.code == 200) {
    return {
      status: true,
      info: res.msg,
      returnData: res.data
    }
  } else {
    return {
      status: false,
      code: res.code,
      info: res.msg
    }
  }
}


const getSchoolInfoList = async function (schoolID, params) {
  console.log('infoList-req:', params)
  let dataResult = await requestData(params)
  console.log('infoList-dataResult:', dataResult)
  if (!dataResult.status) {
    return dataResult
  }

  let url = `${settings.campusServerAddr}/api/read/school/infoList/${schoolID}`
  console.log('infoList-url: ', url)
  let data = {
    developmentKey: settings.campusDevelopmentKey,
    developmentSecret: settings.campusDevelopmentSecret,
    data: dataResult.returnData
  }
  console.log('infoList-data:', data)
  let res = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('infoList-res:', res)
  if (res.code == 200) {

    return {
      status: true,
      info: res.msg,
      returnData: res.data,
      code: res.code
    }
  } else {
    return {
      status: false,
      code: res.code,
      info: res.msg,
      code: res.code
    }
  }
}




const getInfoDetail = async function (infoID) {
  let url = `${settings.campusServerAddr}/api/read/info/infoDetail/${infoID}`
  console.log('getInfoDetail-url: ', url)
  let data = {
    developmentKey: settings.campusDevelopmentKey,
    developmentSecret: settings.campusDevelopmentSecret,
  }
  console.log('getInfoDetail-data:', data)
  let res = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('getInfoDetail-res:', res)
  if (res.code == 200) {
    return {
      status: true,
      info: res.msg,
      returnData: res.data
    }
  } else {
    return {
      status: false,
      code: res.code,
      info: res.msg
    }
  }
}

const checkLogin = function () {
  let loginInfo = wx.getStorageSync('loginInfo')
  if (loginInfo && loginInfo.alumniID && loginInfo.alumniToken) {
    return loginInfo
  } else {
    wx.removeStorageSync('loginInfo')
    wx.removeStorageSync('logined')
    wx.navigateTo({
      url: '/pages/regist_wechat/regist_wechat',
    })
  }
}


const reqAlumniAPI = async function (apiUrl, reqData, changeData=true) {
  let locale = getLocale()
  let loginInfo = checkLogin()
  console.log(`${apiUrl}-req: `, reqData)
  let alumniID;
  if (reqData.alumniID) {
    alumniID = reqData.alumniID
    delete reqData.alumniID
  }
  let alumniToken;
  if (reqData.alumniToken) {
    alumniToken = reqData.alumniToken
    delete reqData.alumniToken
  }

  let res;
  let url = `${settings.campusServerAddr}/${apiUrl}`
  if(changeData) {
    let dataResult = await requestData(reqData)
    if (!dataResult.status) {
      console.log(`${apiUrl}-req-data: `, dataResult)
      return dataResult
    }

    res = await wxRequest(url, {
      hideLoading: true,
      data: {
        alumniID: alumniID || loginInfo.alumniID,
        alumniToken: alumniToken || loginInfo.alumniToken,
        data: dataResult.returnData
      }
    })
  } else {
    res = await wxRequest(url, {
      hideLoading: true,
      data: {
        alumniID: alumniID || loginInfo.alumniID,
        alumniToken: alumniToken || loginInfo.alumniToken,
        ...reqData
      }
    })
  }

  console.log(`${apiUrl}-res:`, res)
  if (res.code == 200) {
    return {
      status: true,
      info: res.msg,
      returnData: res.data
    }
  } else {
    if (res.code == 10011) {
      if (locale == 'zh-CN') {
        wx.showToast({
          title: '用户会话过期即将重新登陆',
          icon: 'none',
          duration: settings.shortToastSec
        })
      } else {
        wx.showToast({
          title: 'Session expired, will login soon',
          icon: 'none',
          duration: settings.shortToastSec
        })
      }
      setTimeout(()=>{
        wx.removeStorageSync('loginInfo')
        wx.removeStorageSync('logined')
        wx.reLaunch({
          url: '/pages/landing/landing',
        })
      }, settings.shortToastSec)
      return
    }
    return {
      status: false,
      code: res.code,
      info: res.msg
    }
  }
}


const reqDevelopAPI = async function (apiUrl, reqData, changeData = true) {
  console.log('req:', reqData)
  if (changeData === true) {
    let dataResult = await requestData(reqData)
    if (!dataResult.status) {
      return dataResult
    }
    let url = `${settings.campusServerAddr}/${apiUrl}`
    let res = await wxRequest(url, {
      hideLoading: true,
      data: {
        developmentKey: settings.campusDevelopmentKey,
        developmentSecret: settings.campusDevelopmentSecret,
        data: dataResult.returnData
      }
    })
    console.log(`${apiUrl}-res:`, res)
    if (res.code == 200) {
      return {
        status: true,
        info: res.msg,
        returnData: res.data
      }
    } else {
      return {
        status: false,
        code: res.code,
        info: res.msg
      }
    }
  } else {
    let url = `${settings.campusServerAddr}/${apiUrl}`
    let res = await wxRequest(url, {
      hideLoading: true,
      data: {
        developmentKey: settings.campusDevelopmentKey,
        developmentSecret: settings.campusDevelopmentSecret,
        data: reqData
      }
    })
    console.log(`${apiUrl}-res:`, res)
    if (res.code == 200) {
      return {
        status: true,
        info: res.msg,
        returnData: res.data
      }
    } else {
      return {
        status: false,
        code: res.code,
        info: res.msg
      }
    }
  }

}


const reqThirdpartyTokenAPI = async function (apiUrl, reqData) {
  let loginInfo = checkLogin()
  console.log(`${apiUrl}-req: `, reqData)
  let alumniID;
  if (reqData.alumniID) {
    alumniID = reqData.alumniID
    delete reqData.alumniID
  }
  let alumniToken;
  if (reqData.alumniToken) {
    alumniToken = reqData.alumniToken
    delete reqData.alumniToken
  }

  let dataResult = await wxRequest(`${settings.campusServerAddr}/api/parameter/changeData`, {
    hideLoading: false,
    data: reqData
  })

  console.log('requestData-res:', dataResult)
  if (dataResult.errMsg != 'request:ok') {
    return {
      status: true,
      info: 'ok',
      returnData: res.data
    }
  }


  // let dataResult = await requestData(reqData)
  // if (!dataResult.status) {
  //   console.log(`${apiUrl}-req-data: `, dataResult)
  //   return dataResult
  // }

  let url = `${settings.campusServerAddr}/${apiUrl}`
  let res = await wxRequest(url, {
    hideLoading: true,
    data: {
      alumniID: alumniID || loginInfo.alumniID,
      alumniToken: alumniToken || loginInfo.alumniToken,
      data: dataResult.returnData
    }
  })
  console.log(`${apiUrl}-res:`, res)
  if (res.status == 7) {
    return {
      status: true,
      info: res.msg,
      returnData: res.returnData
    }
  } else {
    return {
      status: false,
      code: res.status,
      info: res.msg
    }
  }
}

const getMemberInfoList = async function (schoolID,type, params) {
  console.log('infoList-req:', params)
  let dataResult = await requestData(params)
  console.log('infoList-dataResult:', dataResult)
  if (!dataResult.status) {
    return dataResult
  }

  let url = `${settings.campusServerAddr}/api/read/member/infoList/${schoolID}?type=${type}`
  console.log('infoList-url: ', url)
  let data = {
    developmentKey: settings.campusDevelopmentKey,
    developmentSecret: settings.campusDevelopmentSecret,
    data: dataResult.returnData
  }
  console.log('infoList-data:', data)
  let res = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('infoList-res:', res)
  if (res.code == 200) {

    return {
      status: true,
      info: res.msg,
      returnData: res.data,
      code: res.code
    }
  } else {
    return {
      status: false,
      code: res.code,
      info: res.msg,
      code: res.code
    }
  }
}

const getVideoInfoList = async function (schoolID, params) {
  console.log('infoList-req:', params)
  let dataResult = await requestData(params)
  console.log('infoList-dataResult:', dataResult)
  if (!dataResult.status) {
    return dataResult
  }

  let url = `${settings.campusServerAddr}/api/read/video/infoList/${schoolID}`
  console.log('infoList-url: ', url)
  let data = {
    developmentKey: settings.campusDevelopmentKey,
    developmentSecret: settings.campusDevelopmentSecret,
    data: dataResult.returnData
  }
  console.log('infoList-data:', data)
  let res = await wxRequest(url, {
    hideLoading: true,
    data: data
  })
  console.log('infoList-res:', res)
  if (res.code == 200) {

    return {
      status: true,
      info: res.msg,
      returnData: res.data,
      code: res.code
    }
  } else {
    return {
      status: false,
      code: res.code,
      info: res.msg,
      code: res.code
    }
  }
}



export {
  uploadFile,
  uploadFileByDev,
  getPlaceCategoryList,
  getPlaceDetail,
  getSchoolInfoList,
  getInfoDetail,
  getInfoCategoryList,
  reqAlumniAPI,
  reqDevelopAPI,
  reqThirdpartyTokenAPI,
  getMemberInfoList,
  getVideoInfoList
}