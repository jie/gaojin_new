const env = require('./config.js'); 
const Base64 = require('./Base64.js');

require('./hmac.js');
require('./sha1.js');
const Crypto = require('./crypto.js');

// filePath   本地需要上传的文件路径
// dir  文件路径+新文件名
// successc 成功回调函数
// failc  失败回调函数
const uploadFile = function (config, filePath, dir, exp, security_token, successc, failc) {
  if (!filePath || filePath.length <  9) {
    wx.showModal({
      title: '图片错误',
      content: '请重试',
      showCancel: false,
    })
    return;
  }


  // let callback = {
  //   "callbackUrl": config.callbackUrl,
  //   "callbackBody": config.callbackBody
  // }

  // const callbackurl = Base64.encode(JSON.stringify(callback));
  // const aliyunFileKey = dir + filePath.replace('http://tmp/', '');
  const aliyunFileKey = dir;
  const aliyunServerURL = config.uploadImageUrl;//OSS地址，需要https
  const accessid = config.OSSAccessKeyId;
  //const policyBase64 = config.Policy;
  //const signature = config.Signature;
  const policyBase64 = getPolicyBase64(security_token, exp);
  const signature = getSignature(config.AccessKeySecret, policyBase64);//获取签名

  console.log('aliyunFileKey=', aliyunFileKey);
  console.log('aliyunServerURL=', aliyunServerURL);
  let formData = {
    'key': aliyunFileKey,
    'policy': policyBase64,
    'OSSAccessKeyId': accessid,
    'signature': signature,
    'success_action_status': '200',
  }
  console.log('aliyun form:', formData)
  wx.uploadFile({
    url: aliyunServerURL,
    filePath: filePath,
    name: 'file',
    // header: {
    //   "callbackUrl": "http://abc.com/test.php",
    //   "callbackBody": "bucket=${bucket}&object=${object}&etag=${etag}&size=${size}&mimeType=${mimeType}&my_var=${x:my_var}"
    // },
    formData: formData,
    success: function (res) {
      if (res.statusCode != 200) {
        failc(new Error('上传错误:' + JSON.stringify(res)))
        return;
      }
      console.log('上传成功', res)
      successc(aliyunFileKey);
    },
    fail: function (err) {
      err.wxaddinfo = aliyunServerURL;
      failc(err);
    },
  })
}

const getPolicyBase64 = function (expiration) {
  let srcT;
  if (!expiration) {
    let date = new Date();
    date.setHours(date.getHours() + config.timeout);
    srcT = date.toISOString();
  } else {
    srcT = expiration
  }

  const policyText = {
    "expiration": srcT, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了 
    "conditions": [
      ["content-length-range", 0, 5 * 1024 * 1024] // 设置上传文件的大小限制,5mb
    ]
  };

  const policyBase64 = Base64.encode(JSON.stringify(policyText));
  return policyBase64;
}

const getSignature = function (secret, policyBase64) {
  const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, secret, {
    asBytes: true
  });
  const signature = Crypto.util.bytesToBase64(bytes);

  return signature;
}

module.exports = uploadFile;
