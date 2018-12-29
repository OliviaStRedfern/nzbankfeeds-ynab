const fs = require('fs')
const parse = require('csv-parse')
const transform = require('stream-transform')
require('colors')
const CSV_FOLDER_PATH = require('os').homedir() + '/Downloads'

async function convertCSVWithTransformation (transformation, csvFileName) {
  const parser = parse({ delimiter: ',' })
  const csvFile = CSV_FOLDER_PATH + '/' + csvFileName
  const ynabCSVFile = CSV_FOLDER_PATH + '/YNAB-' + csvFileName
  let stats = fs.statSync(csvFile)
  if (!stats.isFile()) {
    console.log(`    ${csvFile} is not a file`)
    return
  }
  const input = fs.createReadStream(csvFile)
  const outputSteam = fs.createWriteStream(ynabCSVFile)
  const transformer = transform(transformation)
  console.log(`invoked function convertCSVWithTransformation(...)`)
  input.pipe(parser).pipe(transformer).pipe(outputSteam)
  console.log(`Completed conversion: ${ynabCSVFile}`)
  return ynabCSVFile
}

const lookupinator = {
  columnNames: undefined,
  record: undefined,
  lookup: function (searchTerm) {
    if (this.columnNames === undefined || this.record === undefined) {
      return 'columnNames and record must be defined before calling lookup()'
    }
    const index = this.columnNames.findIndex(
      columnName => columnName.toLowerCase() === searchTerm.toLowerCase()
    )
    if (this.record[index] === undefined) {
      console.log(`lookupinator error for ${searchTerm}`.red)
    }
    return this.record[index].trim()
  },
}

const YNAB_COLS = [
  'DATE',
  'PAYEE',
  'MEMO',
  'OUTFLOW',
  'INFLOW',
]

module.exports = { convertCSVWithTransformation, lookupinator, YNAB_COLS, CSV_FOLDER_PATH }
