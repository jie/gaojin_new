import { Crypto, Base64 } from "./crypto.js"
const util = {
  aliOssParams(aid, aky, host, expiration) {
    var aid = aid;//你自己的阿里云的accessid
    var aky = aky;//你自己的阿里云的accesskey
    var host = host;//你自己的阿里云域名
    var policyText = {
      "expiration": expiration,//上传的文件失效日期自己定义
      "conditions": [
        ["content-length-range", 0, 10485760000]//上传的内容大小，自己定义
      ]
    };
    var policy = Base64.encode(JSON.stringify(policyText));//生成的加密策略
    var bytes = Crypto.util.HMAC(Crypto.util.SHA1, policy, aky, { asBytes: true });
    var signature = Crypto.util.bytesToBase64(bytes);//生成的签名
    return {
      policy: policy,
      signature: signature,
      aid: aid,
      host: host
    }
  },
  computeSignature(aky, canonicalString) {
    var bytes = Crypto.util.HMAC(Crypto.util.SHA1, aky, canonicalString, { asBytes: true });
    var signature = Crypto.util.bytesToBase64(bytes);//生成的签名
    return signature
  },
  canonicalString(method, resourcePath, request, expires) {
    const headers = {};
    const OSS_PREFIX = 'x-oss-';
    const ossHeaders = [];
    const headersToSign = {};

    let signContent = [
      method.toUpperCase(),
      headers['Content-Md5'] || '',
      headers['Content-Type'] || headers['Content-Type'.toLowerCase()],
      expires || headers['x-oss-date']
    ];

    Object.keys(headers).forEach((key) => {
      const lowerKey = key.toLowerCase();
      if (lowerKey.indexOf(OSS_PREFIX) === 0) {
        headersToSign[lowerKey] = String(headers[key]).trim();
      }
    });

    Object.keys(headersToSign).sort().forEach((key) => {
      ossHeaders.push(`${key}:${headersToSign[key]}`);
    });
    signContent = signContent.concat(ossHeaders);
    signContent.push(this.buildCanonicalizedResource(resourcePath, request.parameters));
    return signContent.join('\n');
  },
  buildCanonicalizedResource(resourcePath, parameters) {
    let canonicalizedResource = `${resourcePath}`;
    let separatorString = '?';
    parameters.sort();
    canonicalizedResource += separatorString + parameters.join('&');
    return canonicalizedResource;
  }

}

export { util }  
