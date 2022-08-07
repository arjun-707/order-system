const moment = require('moment')

const getCurrentDateTime = (todayDt = new Date()) => {
  return {
    currentDate: moment(todayDt).format('YYYY-MM-DD'),
    currentStartDateTime: moment(todayDt).format('YYYY-MM-DD 00:00:00'),
    currentEndDateTime: moment(todayDt).format('YYYY-MM-DD 23:59:59'),
  }
}

module.exports = {
  getCurrentDateTime
}