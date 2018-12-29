const moment = require('moment')
const { convertCSVWithTransformation, lookupinator, YNAB_COLS } = require('./csv-converter')
require('colors')

const SOURCE_COLS = [
  'Type',
  'Details',
  'Particulars',
  'Code',
  'Reference',
  'Amount',
  'Date',
  'ForeignCurrencyAmount',
  'ConversionCharge',
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
    let date = lookupinator.lookup('date')
    let dateMoment = moment(date, 'DD-MM-YYYY')
    row += `${dateMoment.format('MM/DD/YYYY')},`

    // PAYEE
    let payee = lookupinator.lookup('code')
    let details = lookupinator.lookup('details')
    if (payee === '2380   C') {
      [payee, details] = [details, payee]
    }

    row += `"${payee}",`

    // MEMO
    row += `"${details} ${lookupinator.lookup('particulars')} ${lookupinator.lookup('reference')}",`

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
