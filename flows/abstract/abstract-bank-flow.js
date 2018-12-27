const { CSV_FOLDER_PATH } = require('../../convertCSV/csv-converter')
const fs = require('fs')
const { isCSV } = require('../../utils/file-system')
const AbstractFlow = require('./abstract-flow')
const { AbstractMethodInvocationError, ClassInitializationError } = require('../../utils/error-classes')

class AbstractBankFlow extends AbstractFlow {
  constructor (SECRETS, SELECTORS, urlLogin, urlHome) {
    if (!SECRETS || !SELECTORS || !urlLogin || !urlHome) {
      throw new ClassInitializationError()
    }
    super(SECRETS, SELECTORS, urlLogin, urlHome)
    this.logColor = 'green'

    this.log('AbstractBankFlow object created')

    this.DATE_FORMAT = 'DD/MM/YYYY'
    this.fs = fs
    this.isCSV = isCSV
    this.CSV_FOLDER_PATH = CSV_FOLDER_PATH

    // Must be overridden
    this.ynabAccount = undefined
    this.csvConvert = undefined
  }

  static convertCSV () {
    throw new AbstractMethodInvocationError()
  }
  static accountName () {
    throw new AbstractMethodInvocationError()
  }
  async navigateToExportTransactions (page) {
    throw new AbstractMethodInvocationError()
  }
  async fillDateField (page, selector, mmmoment) {
    throw new AbstractMethodInvocationError()
  }
  getAccountSelector () {
    throw new AbstractMethodInvocationError()
  }
  downloadTransactions () {
    throw new AbstractMethodInvocationError()
  }
  async downloadCSV (page, downloadSelector) {
    return new Promise(resolve => {
      const watcher = this.fs.watch(this.CSV_FOLDER_PATH, {}, (_eventType, fileName) => {
        if (this.isCSV(fileName)) {
          watcher.close()
          resolve(fileName)
        }
      })
      page.click(downloadSelector)
    })
  }

  async getCSV (page, startMoment, endMoment) {
    await this.authenticate(page)
    await this.navigateToExportTransactions(page)
    return this.downloadTransactions(page, startMoment, endMoment)
  }
  async logout (page) {
    this.log('invoked AbstractBankFlow::logout')
    this.log("    didn't logout: not implemented")
  }
}

module.exports = AbstractBankFlow
