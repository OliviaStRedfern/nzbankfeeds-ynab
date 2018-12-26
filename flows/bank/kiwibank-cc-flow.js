const KiwibankFlow = require('./kiwibank-flow')
const csvConvert = require('../../convertCSV/kiwibank-cc2ynab')
const { ynabAccounts } = require('../ynab/ynab-flow')

class KiwibankCCFlow extends KiwibankFlow {
  constructor (secrets) {
    super(secrets)
    this.log('KiwibankFlowCC object created')
    this.csvConvert = csvConvert
    this.ynabAccount = ynabAccounts.KiwibankCC
    this.SELECTORS.export.selectFormatCSV = 'CSV-Basic'
  }

  getAccountSelector () {
    return this.SELECTORS.accounts.getSelectorForAccount(this.SELECTORS.accounts.cc)
  }
}

module.exports = KiwibankCCFlow
