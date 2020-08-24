// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'aftercrm-pro-icwjw'
})


const getDataByCloudID = function (event, wxContext) {
  return {
    status: true,
    data: event
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  switch (event.apiName) {
    case 'getDataByCloudID':
      return getDataByCloudID(event, wxContext)
    default:
      return {
        status: false,
        message: 'api_name_required'
      }
  }
}