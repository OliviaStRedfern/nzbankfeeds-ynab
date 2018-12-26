const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect
const AbstractBankFlowMock = require('./mocks/abstract-bank-flow-mock')
const pageMock = require('./mocks/page-mock')
const { SECRETS, SELECTORS: MOCK_SELECTORS, urlLogin, urlHome } = require('./mocks/config-mock')

const abstractBankFlow = () => {
  return new AbstractBankFlowMock(SECRETS, MOCK_SELECTORS, urlLogin, urlHome)
}
const SELECTORS = {
  download: '#download'
}
const testFileName = () => {
  return `${Date.now()}-stanchion-download-test.csv`
}
const NOOP = () => { }

describe('can instantiate', () => {
  it('instantiates', () => {
    const flow = abstractBankFlow()
    expect(flow instanceof AbstractBankFlowMock).to.be.true
  })
})

describe('OO hygiene', () => {
  it('does not allow abstract functions without overrides to be called', async () => {
    const flow = abstractBankFlow()
    expect(flow.navigateToExportTransactions(null)).be.rejectedWith('AbstractMethodInvocationError')
    expect(flow.fillDateField(null)).be.rejectedWith('AbstractMethodInvocationError')
    expect(flow.downloadTransactions.bind(flow)).to.throw('AbstractMethodInvocationError')
    expect(flow.getAccountSelector.bind(flow)).to.throw('AbstractMethodInvocationError')
    expect(AbstractBankFlowMock.convertCSV.bind(AbstractBankFlowMock)).to.throw('AbstractMethodInvocationError')
    expect(AbstractBankFlowMock.accountName.bind(AbstractBankFlowMock)).to.throw('AbstractMethodInvocationError')
  })
})

describe('Member functions', () => {
  it('downloadCSV works right', async () => {
    const page = pageMock()
    const flow = abstractBankFlow()

    const fs = flow.fs
    const path = flow.CSV_FOLDER_PATH
    const fileName = testFileName()
    flow.isCSV = () => { return true }

    const promise = flow.downloadCSV(page, SELECTORS.download)

    await fs.writeFile(`${path}/${fileName}`, 'a,b,c', NOOP)

    await promise.then((value) => {
      expect(value).to.equal(fileName)
    })
  })
  it('getCSV works right', async () => {
    const page = pageMock()
    const flow = abstractBankFlow()
    const fileName = testFileName()
    let loginCalls = 0
    let navigateToExportTransactionsCalls = 0
    let downloadTransactionsCalls = 0
    flow.login = async (_page) => {
      loginCalls++
      return true
    }
    flow.navigateToExportTransactions = async (_page) => {
      navigateToExportTransactionsCalls++
      return true
    }
    flow.downloadTransactions = async (_page, _start, _end) => {
      downloadTransactionsCalls++
      return fileName
    }
    const value = await flow.getCSV(page, null, null)
    expect(loginCalls).to.equal(1)
    expect(navigateToExportTransactionsCalls).to.equal(1)
    expect(downloadTransactionsCalls).to.equal(1)
    expect(value).to.equal(fileName)
  })
})
