import moment from './moment.min.js'
// 获取今天
function getToday() {
  let today = `${moment().format('YYYY-MM-DD')} 00:00:00`
  let tomorrow = `${moment().format('YYYY-MM-DD')} 23:59:59`
  return [today, tomorrow]
}
// 获取明天
function getTomorrow() {
  let tomorrow = `${moment().add('days', 1).format('YYYY-MM-DD')} 00:00:00`
  let theDayAfterTomorrow = `${moment().add('days', 1).format('YYYY-MM-DD')} 23:59:59`
  return [tomorrow, theDayAfterTomorrow]
}

// 获取昨天的开始结束时间
function getYesterday() {
  let date = []
  date.push(moment().subtract('days', 1).format('YYYY-MM-DD'))
  date.push(moment().subtract('days', 1).format('YYYY-MM-DD'))
  return date
}
// 获取最近七天的开始结束时间
function getLast7Days() {
  let date = []
  date.push(moment().subtract('days', 7).format('YYYY-MM-DD'))
  date.push(moment().subtract('days', 1).format('YYYY-MM-DD'))
  return date
}
// 获取最近30天的开始结束时间
function getLast30Days() {
  let date = []
  date.push(moment().subtract('days', 30).format('YYYY-MM-DD'))
  date.push(moment().subtract('days', 1).format('YYYY-MM-DD'))
  return date
}
// 获取上一周的开始结束时间
function getLastWeekDays() {
  debugger
  let date = []
  let weekOfday = parseInt(moment().format('d')) // 计算今天是这周第几天  周日为一周中的第一天
  let start = moment().subtract(weekOfday + 7, 'days').format('YYYY-MM-DD') // 周一日期
  let end = moment().subtract(weekOfday + 1, 'days').format('YYYY-MM-DD') // 周日日期
  date.push(start)
  date.push(end)
  return date
}
// 获取上一个月的开始结束时间
function getLastMonthDays() {
  let date = []
  let start = moment().subtract('month', 1).format('YYYY-MM') + '01'
  let end = moment(start).subtract('month', -1).add('days', -1).format('YYYY-MM-DD')
  date.push(start)
  date.push(end)
  return date
}
// 获取当前周的开始结束时间
function getCurrWeekDays() {
  let date = []
  let weekOfday = parseInt(moment().format('d')) // 计算今天是这周第几天 周日为一周中的第一天
  let start = `${moment().subtract(weekOfday, 'days').format('YYYY-MM-DD')} 00:00:00` // 周一日期
  let end = `${moment().add(6 - weekOfday, 'days').format('YYYY-MM-DD')} 23:59:59` // 周日日期
  return [start, end]
}
// 获取当前月的开始结束时间
function getCurrMonthDays() {
  let start = moment().add('month', 0).format('YYYY-MM') + '-01'
  start = `${start} 00:00:00`
  let end = moment(start).add('month', 1).add('days', -1).format('YYYY-MM-DD')
  end = `${end} 23:59:59`
  return [start, end]
}

function getCurrWeekendDays() {
  let start = moment().endOf('week').format('YYYY-MM-DD 00:00:00')
  let end = moment().endOf('week').add('days', 1).format('YYYY-MM-DD 23:59:59')
  return [start, end]
}

function getCurrYearDays() {
  let start = moment().startOf('year').format('YYYY-MM-DD 00:00:00')
  let end = moment().endOf('year').format('YYYY-MM-DD 23:59:59')
  return [start, end]
}

export {
  getToday,
  getTomorrow,
  getYesterday,
  getLast7Days,
  getLast30Days,
  getLastWeekDays,
  getLastMonthDays,
  getCurrWeekDays,
  getCurrMonthDays,
  getCurrWeekendDays,
  getCurrYearDays
}
