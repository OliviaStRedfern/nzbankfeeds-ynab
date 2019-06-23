require('colors')
const _ = require('lodash')
const AbstractLogger = require('../abstract/abstract-logger')
const moment = require('moment')
const { prompt } = require('../../utils/helpers')
const ynab = require('ynab')
const ynabAPI = new ynab.API(process.env.YNAB_ACCESS_TOKEN)
const budgetName = 'My Budget'
const NOOP = () => { }

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
  constructor() {
    super()
    this.logColor = 'yellow'
    this.log('YNABFlow object created')
  }

  async getMostRecentTransactionMoment (page, ynabAccount) {
    const budgetsResponse = await ynabAPI.budgets.getBudgets()
    const budgetID = budgetsResponse.data.budgets[0].id

    this.log('invoked YNABFlow::getMostRecentTransactionDate')

    // Assumes that our accounts are in the first budget returned by the API

    // await this.authenticate(page)

    // await page.waitForSelector(ynabAccount.selector)
    // await page.click(ynabAccount.selector)

    // // await page.waitForSelector(SELECTORS.import.resetFilters)

    // // const resetButton = await page.$$(SELECTORS.import.resetFilters)
    // // if (resetButton.length === 1) {
    // //   await page.click(SELECTORS.import.resetFilters)
    // // }

    // const transactionDateElements = await page.$$(SELECTORS.import.transactionDates)
    // if (transactionDateElements.length === 0) {
    //   this.log(`    YNAB is already up to date`.green)
    //   return null
    // }
    // const mostRecentTransactionDate = await page.evaluate(
    //   el => el.innerText.trim(), transactionDateElements[0]
    // )

    // this.log(`    found YNAB most recent transaction date ${mostRecentTransactionDate}`.green)

    // const mostRecentTransactionMoment = moment(mostRecentTransactionDate, 'DD-MM-YYYY')

    // return mostRecentTransactionMoment
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
