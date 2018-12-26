const WestpacFlow = require('./westpac-flow')
const csvConvert = require('../../convertCSV/westpac2ynab')
const { ynabAccounts } = require('../ynab/ynab-flow')

class WestpacFlowCC extends WestpacFlow {
  constructor (secrets) {
    super(secrets)
    this.log('WestpacFlow object created')
    this.ynabAccount = ynabAccounts.WestpacCC
    this.csvConvert = csvConvert
  }

  getAccountSelector () {
    return this.SELECTORS.accounts.getSelectorForAccount(this.SELECTORS.accounts.cc)
  }
}

module.exports = WestpacFlowCC
