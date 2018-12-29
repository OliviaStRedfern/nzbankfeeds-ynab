const moment = require('moment')
const { convertCSVWithTransformation, lookupinator, YNAB_COLS } = require('./csv-converter')
require('colors')

const SOURCE_COLS = [
  'Date',
  'Memo/Description',
  '?',
  'Amount',
]

let isFirst = true
const transformation = function (record, callback) {
  lookupinator.columnNames = SOURCE_COLS
  lookupinator.record = record
  let row = ''
  if (isFirst) {
    isFirst = false
    row += YNAB_COLS.join(',')
  } else {
    // DATE
    let date = lookupinator.lookup('Date')
    let dateMoment = moment(date, 'DD-MM-YYYY')
    row += `${dateMoment.format('MM/DD/YYYY')},`

    // PAYEE
    let payee = lookupinator.lookup('Memo/Description')
    row += `"${payee}",`

    // MEMO
    let memo = lookupinator.lookup('?')
    row += `"${memo}",`

    // OUTFLOW / INFLOW
    let amount = lookupinator.lookup('amount')
    if (amount > 0) {
      row += `,${amount}`
    } else {
      row += `${Math.abs(amount)},`
    }
  }
  console.log(row.dim)
  callback(null, row + '\n')
}

module.exports = (csvFileName) => convertCSVWithTransformation(transformation, csvFileName)
