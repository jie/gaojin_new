import apis from './apis'

const settings = {
  apis: apis,
  enviroment: 'pro_kedge',
  version: '0.10.3',
  
  // 高金环境
  // cfgId: "s4itsrd01p7s",
  // opCliId: "2x02te18u579mr6z",
  // //成产环境
  // opCliId: "2x02te18u579mr6z", //组织id
  // cfgId: "1cef7z1ebstu",// 应用id
  opCliId: "113kigga3l4jq1m1", //组织id
  cfgId: "7uhrokkfb6vo",// 应用id
  server_addr: 'https://www.aftercrm.com',
  bridge_addr: "https://bridge.aftercrm.com/bridgeGaojin",
  // bridge_pay_addr: "https://bridge.aftercrm.com/bridgeKedge/pay/wx",
  // 校友会
  // campusServerAddr: "https://wx.aemba.com.cn",

  campusServerAddr: "https://mba-events.saif.sjtu.edu.cn",
  campusDevelopmentKey: "Z2NQGTWB7V2LRQDT",
  campusDevelopmentSecret: "k0cbkqc54s2rucj7",
  schoolID: 9,
  // 腾讯地图
  ttMapKey: "OUTBZ-BVTWX-T3I4A-ZRNDK-6OBBS-OBBZX",
  longToastSec: 10000,
  shortToastSec: 5000,
  TAB_URLS: [
    "/pages/home_blank/home_blank",
    "/pages/gaojin/project/project",
    "/pages/events/events",
    "/pages/mine_kedge/mine_kedge",
  ],
  HOME_URL: "/pages/home_blank/home_blank",
  //theme
  THEME: {
    bgColor: '#b6a37e'
  },
  extraNavStyle: {
    urls: [
      "/pages/home_ceibs_v2/home_ceibs",
      "/pages/events/events",
      "/pages/events_ceibs/events",
      "/pages/guest_detail/guest_detail",
      "/pages/replies/replies",
      "/pages/ticket/ticket",
      "/pages/mine_events/mine_events",
      "/pages/mine_kedge/mine_kedge"
    ],
    frontColor: '#ffffff',
    backgroundColor: "#27272A"
  }
};
export default settings;
