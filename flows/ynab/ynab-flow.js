require('colors')
const AbstractFlow = require('../abstract/abstract-flow')
const moment = require('moment')
const { prompt } = require('../../utils/helpers')
const { ClassInitializationError } = require('../../utils/error-classes')

const Kiwibank = {
  selector: '.nav-accounts .nav-account.onBudget a.nav-account-row:nth-of-type(1)',
}
const Westpac = {
  selector: '.nav-accounts .nav-account.onBudget a.nav-account-row:nth-of-type(2)',
}
const BNZ = {
  selector: '.nav-accounts .nav-account.onBudget a.nav-account-row:nth-of-type(3)',
}
const WestpacCC = {
  selector: '.nav-accounts .nav-account.onBudget a.nav-account-row:nth-of-type(4)',
}
const KiwibankCC = {
  selector: '.nav-accounts .nav-account.onBudget a.nav-account-row:nth-of-type(5)',
}
const ANZ = {
  selector: '.nav-accounts .nav-account.onBudget a.nav-account-row:nth-of-type(7)',
}

const ynabAccounts = {
  ANZ, BNZ, Kiwibank, KiwibankCC, Westpac, WestpacCC,
}

const URLS = {
  login: 'https://app.youneedabudget.com/users/login',
  home: 'https://app.youneedabudget.com',
}

const SELECTORS = {
  login: {
    userIDField: '#login-username',
    passwordField: '#login-password',
    loginButton: 'button[type=submit]',
  },
  import: {
    transactionDates: '.content .ynab-grid-body-row:not(.is-scheduled):not(.needs-approved) .ynab-grid-cell-date',
    startImportButton: 'button.accounts-toolbar-file-import-transactions',
    resetFilters: '[data-register-area=ResetFilters]',
    animationDelay: 200,
    choseImportFile: 'input[type=file]',
    confirmImport: '.modal .button-primary',
    ok: '.modal .button-primary',
  },
}

class YNABFlow extends AbstractFlow {
  constructor (SECRETS) {
    if (!SECRETS) {
      throw new ClassInitializationError()
    }
    super(SECRETS, SELECTORS, URLS.login, URLS.home)
    this.__filename = __filename

    this.logColor = 'yellow'
    this.log('YNABFlow object created')
  }

  async getMostRecentTransactionMoment (page, ynabAccount) {
    this.log('invoked YNABFlow::getMostRecentTransactionDate')

    await this.authenticate(page)

    await page.waitForSelector(ynabAccount.selector)
    await page.click(ynabAccount.selector)

    await page.waitForSelector(SELECTORS.import.resetFilters)

    const resetButton = await page.$$(SELECTORS.import.resetFilters)
    if (resetButton.length === 1) {
      await page.click(SELECTORS.import.resetFilters)
    }

    const transactionDateElements = await page.$$(SELECTORS.import.transactionDates)
    if (transactionDateElements.length === 0) {
      this.log(`    YNAB is already up to date`.green)
      return null
    }
    const mostRecentTransactionDate = await page.evaluate(
      el => el.innerText.trim(), transactionDateElements[0]
    )

    this.log(`    found YNAB most recent transaction date ${mostRecentTransactionDate}`.green)

    const mostRecentTransactionMoment = moment(mostRecentTransactionDate, 'DD-MM-YYYY')

    return mostRecentTransactionMoment
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
