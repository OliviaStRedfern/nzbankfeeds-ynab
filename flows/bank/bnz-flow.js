const { prompt, isSelectorVisible } = require('../../utils/helpers')
const moment = require('moment')
const csvConvert = require('../../convertCSV/bnz2ynab')
const AbstractBankFlow = require('../abstract/abstract-bank-flow')
const { ynabAccounts } = require('../ynab/ynab-flow')
const { ClassInitializationError } = require('../../utils/error-classes')

const URL = 'https://secure.bnz.co.nz/auth/personal-login'
const HOME = 'https://www.bnz.co.nz/client/'
const SELECTORS = {
  login: {
    userIDField: '#field-principal',
    passwordField: '#field-credentials',
    loginButton: 'form button',
  },
  onlineCode: {
    onlineCodeField: '#online-code',
    verifyButton: '#verify',
  },
  accounts: {
    closePromo: '.intercom-note-close',
    cc: 'CreditCardDetailsView',
    getSelectorForAccount (accountType) {
      return `.transactions-panel .${accountType}`
    },
  },
  export: {
    link: 'button.js-export',
    selectFormatOpen: 'select[name=format]',
    selectFormatCSV: 'option[value=CSV]',
    startDateField: 'input[name=fromDate]',
    endDateField: 'input[name=toDate]',
    exportButton: '.ReactModal__Content form button[class^=Button]:enabled',
  },
  logout: {
    menu: 'button.MenuButton',
    logoutButton: 'button.js-main-menu-logout',
  },
}
class BNZFlow extends AbstractBankFlow {
  constructor (SECRETS) {
    if (!SECRETS) {
      throw new ClassInitializationError()
    }

    super(SECRETS, SELECTORS, URL, HOME)
    this.__filename = __filename

    this.log('BNZFlow object created')
    this.ynabAccount = ynabAccounts.BNZ
    this.csvConvert = csvConvert
  }

  async login (page) {
    this.log('invoked BNZFlow::login')

    await super.login(page)

    await prompt('Authorize your login using your device, then press enter')
  }

  async navigateToExportTransactions (page) {
    this.log('invoked BNZFlow::navigateToExportTransactions')

    if (await isSelectorVisible(page, this.SELECTORS.accounts.closePromo)) {
      await page.click(this.SELECTORS.accounts.closePromo)
    }

    await page.waitForSelector(this.SELECTORS.accounts.getSelectorForAccount(this.SELECTORS.accounts.cc))

    await page.click(this.SELECTORS.export.link)

    await page.waitForSelector(this.SELECTORS.export.selectFormatOpen)

    // BNZ now defaults to CSV
    // await page.click(this.SELECTORS.export.selectFormatOpen)
    // await page.click(this.SELECTORS.export.selectFormatCSV)
  }

  async downloadTransactions (page, startMoment, endMoment) {
    this.log(`invoked BNZFlow::downloadTransactions with startMoment:${startMoment} and endMoment:${endMoment}`)

    await this.fillDateField(page, this.SELECTORS.export.startDateField, startMoment)
    await this.fillDateField(page, this.SELECTORS.export.endDateField, endMoment)

    await page.waitForSelector(this.SELECTORS.export.exportButton)
    return super.downloadCSV(page, this.SELECTORS.export.exportButton)
  }

  async fillDateField (page, selector, mmmoment) {
    this.log(`invoked BNZFlow::fillDateField with selector:${selector} and mmmoment:${mmmoment}`)

    // BNZ date selectors barf if today is selected, "dates must be in the past"
    const todayMoment = moment()
    if (mmmoment.isSame(todayMoment, 'day')) {
      mmmoment.subtract(1, 'days')
    }

    const date = mmmoment.format(this.DATE_FORMAT)

    await page.click(selector)
    await page.keyboard.type(date)
    await page.keyboard.press('Tab')

    this.log(`    typed ${date}`)
  }
}

module.exports = BNZFlow
