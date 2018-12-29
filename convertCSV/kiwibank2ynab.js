const moment = require('moment')
const { convertCSVWithTransformation, lookupinator, YNAB_COLS } = require('./csv-converter')
require('colors')

const SOURCE_COLS = [
  'Account number',
  'Date',
  'Memo/Description',
  'Source Code (payment type)',
  'TP ref', 'TP part', 'TP code',
  'OP ref', 'OP part', 'OP code', 'OP name', 'OP Bank Account Number',
  'Amount (credit)', 'Amount (debit)', 'Amount', 'Balance',
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
    let payee = lookupinator.lookup('OP name')
    payee += '-' + lookupinator.lookup('TP code')
    payee += '-' + lookupinator.lookup('OP part')
    row += `"${payee}",`

    // MEMO
    row += `"`
    row += lookupinator.lookup('Memo/Description')
    row += `",`

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
