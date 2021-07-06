function random(low, high) {
  if (arguments.length === 1) {
    high = low
    low = 0
  }
  return Math.floor(low + Math.random() * (high - low))
}
function randomOne(arr) {
  return arr[random(arr.length)]
}
function getDataString(date, fmt = 'yyyy/MM/dd') {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}
function getWeekStartDateAndEndDateRange() {
  let oneDayLong = 24 * 60 * 60 * 1000
  let now = new Date()
  let mondayTime = now.getTime() - (now.getDay() - 1) * oneDayLong
  let sundayTime = now.getTime() + (7 - now.getDay()) * oneDayLong
  let monday = new Date(mondayTime)
  let sunday = new Date(sundayTime)
  let weekRange = [getDataString(monday), getDataString(sunday)]
  return weekRange
}

function getMonthStartDateAndDateRange() {
  let oneDayLong = 24 * 60 * 60 * 1000
  let now = new Date()
  let year = now.getFullYear()
  let monthStartDate = new Date(year, now.getMonth(), 1) //当前月1号
  let nextMonthStartDate = new Date(year, now.getMonth() + 1, 1) //下个月1号
  let days = (nextMonthStartDate.getTime() - monthStartDate.getTime()) / oneDayLong //计算当前月份的天数
  let monthEndDate = new Date(year, now.getMonth(), days)
  let monthRange = [getDataString(monthStartDate), getDataString(monthEndDate)]
  return monthRange
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

export default {
  install(vue) {
    this.addGlobalMethods(vue)
  },
  addGlobalMethods(vue) {
    vue.prototype.$random = random
    vue.prototype.$randomOne = randomOne
    vue.prototype.$getDataString = getDataString
    vue.prototype.$getWeekStartDateAndEndDateRange = getWeekStartDateAndEndDateRange
    vue.prototype.$getMonthStartDateAndDateRange = getMonthStartDateAndDateRange
  }
}
