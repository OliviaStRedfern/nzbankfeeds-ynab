const { prompt, wait, overwriteDateField } = require('../../utils/helpers')
const AbstractBankFlow = require('../abstract/abstract-bank-flow')
const csvConvert = require('../../convertCSV/anz2ynab')
const { ynabAccounts } = require('../ynab/ynab-flow')
const { ClassInitializationError } = require('../../utils/error-classes')

const URL = 'https://secure.anz.co.nz/IBCS/service/home'
const SELECTORS = {
  login: {
    userIDField: '#user-id',
    passwordField: '#password',
    loginButton: '#submit'
  },
  onlineCode: {
    onlineCodeField: '#online-code',
    verifyButton: '#verify'
  },
  accounts: {
    cheque: 'im',
    loan: 'loan',
    kiwisaver: 'investment',
    getSelectorForAccount (accountType) {
      return `.account-group.${accountType} h3.account-name a`
    }
  },
  export: {
    link: '#transactions-export-panel-toggle',
    animationDelay: 1000,
    startDateField: 'input[name=start-date]',
    endDateField: 'input[name=end-date]',
    exportButton: '#transaction-export-submit'
  }
}
class ANZFlow extends AbstractBankFlow {
  constructor (SECRETS) {
    if (!SECRETS) {
      throw new ClassInitializationError()
    }

    super(SECRETS, SELECTORS, URL, URL)

    this.log('ANZFlow object created')
    this.ynabAccount = ynabAccounts.ANZ
    this.csvConvert = csvConvert
  }

  async login (page) {
    this.log('invoked ANZFlow::login')

    await super.login(page)

    const onlineCode = await prompt('Enter your online code: ')

    await page.click(this.SELECTORS.onlineCode.onlineCodeField)
    await page.keyboard.type(onlineCode)

    await page.click(this.SELECTORS.onlineCode.verifyButton)
    await page.waitForNavigation()
  }

  async navigateToExportTransactions (page) {
    this.log('invoked ANZFlow::navigateToExportTransactions')

    await page.waitForSelector(this.SELECTORS.accounts.getSelectorForAccount(this.SELECTORS.accounts.cheque))
    await page.click(this.SELECTORS.accounts.getSelectorForAccount(this.SELECTORS.accounts.cheque))

    await page.waitForSelector(this.SELECTORS.export.link)
    await page.click(this.SELECTORS.export.link)

    await wait(this.SELECTORS.export.animationDelay)
  }

  async downloadTransactions (page, startMoment, endMoment) {
    this.log(`invoked ANZFlow::downloadTransactions`)

    await this.fillDateField(page, this.SELECTORS.export.startDateField, startMoment)
    await this.fillDateField(page, this.SELECTORS.export.endDateField, endMoment)

    return super.downloadCSV(page, this.SELECTORS.export.exportButton)
  }

  async fillDateField (page, selector, mmmoment) {
    this.log('invoked ANZFlow::fillDateField')
    await overwriteDateField(page, selector, mmmoment, this.DATE_FORMAT)
  }
}

module.exports = ANZFlow
