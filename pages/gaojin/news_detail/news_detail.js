import regeneratorRuntime from '../../../libs/regenerator-runtime/runtime'
import { getInfoDetail } from '../../../campus_lib/api'
import PageBehavior from '../../../utils/page_behaviors'
import mergePages from '../../../libs/objectUtils'
import moment from '../../../libs/moment.min.js'
var WxParse = require('../../../libs/wxParse/wxParse.js');

const PageObject = mergePages({}, PageBehavior, {
  data: {
    pageName: "news_detail",
    entity: "影响力投资论坛：未来属于年轻人",//标题
    content: "<p>4月12日，四川省木里藏族自治县人民政府办公室官方微博发布情况通报：凉山州木里县乔瓦镇锄头湾村与项脚乡项脚村交界处森林火灾情况通报（十五）据木里县森林公安局办公室提供消息：木里县项脚乡瓦科梁子“3.28”森林火灾案。</p>经查：此次森林火灾系犯罪嫌疑人田某某（男，11岁）于2020年3月28日14时在木里县项脚乡项脚村瓦科组田某某家后山处用打火机点燃松针和木罗松烟熏洞内松鼠时不慎失火引发。目前此案正在进一步侦查中。<image src='https://n.sinaimg.cn/spider2020412/708/w1156h352/20200412/68cf-isehnni4833315.png'></image>",//内容
    intro: "我是介绍"//介绍
  },
  getEntity: async function (infoID) {
    let result = await getInfoDetail(infoID)
    console.log(result)
    if (!result.status) {
      this.showToast(result.info)
      return
    }
    result.returnData._createAt = moment(result.returnData.updateTime).format('YYYY-MM-DD')
    this.setData({
      entity: result.returnData
    })
    var vm = this;
    if (this.data.locale == 'zh-CN') {
      WxParse.wxParse('content', 'html', this.data.entity.infoContent, vm, 5);
      WxParse.wxParse('intro', 'html', this.data.entity.infoParameter, vm, 5);
    } else {
      WxParse.wxParse('content', 'html', this.data.entity.infoContentEN, vm, 5);
      WxParse.wxParse('intro', 'html', this.data.entity.infoParameterEN, vm, 5);
    }
  },

  _onLoad: function (options) {
    this.getEntity(options.infoID)
    console.log('getNewInfos=================================',this.data.entity)

    WxParse.wxParse('content', 'html', this.data.content, this, 5);
  }
})
Page(PageObject)