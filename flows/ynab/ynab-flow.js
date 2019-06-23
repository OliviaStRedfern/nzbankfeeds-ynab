require('colors')
const _ = require('lodash')
const AbstractLogger = require('../abstract/abstract-logger')
const moment = require('moment')
const { prompt } = require('../../utils/helpers')
const ynab = require('ynab')
const budgetName = 'My Budget'

const Kiwibank = {
  name: 'Kiwibank Current',
}
const Westpac = {
  name: 'Westapac Current',
}
const BNZ = {
  name: 'BNZ VISA',
}
const WestpacCC = {
  name: 'Westapac Mastercard',
}
const KiwibankCC = {
  name: 'Kiwibank CC',
}
const ANZ = {
  name: 'ANZ Current 00',
}

const ynabAccounts = {
  ANZ, BNZ, Kiwibank, KiwibankCC, Westpac, WestpacCC,
}

class YNABFlow extends AbstractLogger {
  constructor (ynabAPI) {
    super()
    if (ynabAPI === undefined) {
      this.ynabAPI = new ynab.API(process.env.YNAB_ACCESS_TOKEN)
    } else {
      this.ynabAPI = ynabAPI
    }
    this.budgetName = budgetName
    this.logColor = 'yellow'
    this.log('YNABFlow object created')
  }

  async getBudgetId () {
    const budgets = await this.ynabAPI.budgets.getBudgets()
    const budget = _.findLast(budgets.data.budgets, (b) => {
      return b.name === this.budgetName
    })
    return budget.id
  }

  async getAccountId (budgetId, accountName) {
    const accounts = await this.ynabAPI.accounts.getAccounts(budgetId)
    const account = _.findLast(accounts.data.accounts, (a) => {
      return a.name === accountName
    })
    return account.id
  }

  async getMostRecentTransaction (budgetId, accountId) {
    const transactions = await this.ynabAPI.transactions.getTransactionsByAccount(budgetId, accountId)
    return transactions.data.transactions[transactions.data.transactions.length - 1]
  }

  async getMostRecentTransactionMoment (page, ynabAccount) {
    const budgetId = await this.getBudgetId()
    const accountId = await this.getAccountId(budgetId, ynabAccount.accountName)
    const transaction = await this.getMostRecentTransaction(budgetId, accountId)

    return moment(transaction.date, 'YYYY-MM-DD')
  }

  async uploadCSV (page, ynabAccount, fileName) {
    this.log('invoked YNABFlow::uploadCSV')
    this.log(`    file: ${fileName}`)

    await page.waitForSelector(ynabAccount.selector)
    await page.click(ynabAccount.selector)
    await page.click(SELECTORS.import.startImportButton)
    await page.waitForSelector(SELECTORS.import.choseImportFile)
    const elementHandle = await page.$(SELECTORS.import.choseImportFile)

    await elementHandle.uploadFile(fileName)

    await page.waitForSelector(SELECTORS.import.confirmImport)
    await page.click(SELECTORS.import.confirmImport)

    await page.waitForSelector(SELECTORS.import.ok)
    await page.click(SELECTORS.import.ok)

    prompt('Import complete. 😀  Press enter to continue')
  }
  async gotoHome (page) {
    await page.goto(URLS.home)
  }
}

module.exports = { YNABFlow, ynabAccounts }
