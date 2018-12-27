const { expect } = require('./helpers/setup-chai')
const sinon = require('sinon')
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
    // act
    const flow = abstractBankFlow()

    // assert
    expect(flow instanceof AbstractBankFlowMock).to.be.true
  })
  it('does not allow instantiation without valid parameters', () => {
    // assert
    expect(() => new AbstractBankFlowMock()).to.throw('ClassInitializationError')
    expect(() => new AbstractBankFlowMock(null, null, null, null)).to.throw('ClassInitializationError')
  })
})

describe('OO hygiene', () => {
  it('does not allow abstract functions without overrides to be called', async () => {
    // act
    const flow = abstractBankFlow()

    // assert
    expect(flow.downloadTransactions.bind(flow)).to.throw('AbstractMethodInvocationError')
    expect(flow.getAccountSelector.bind(flow)).to.throw('AbstractMethodInvocationError')

    // async
    expect(flow.navigateToExportTransactions(null)).be.rejectedWith('AbstractMethodInvocationError')
    expect(flow.fillDateField(null)).be.rejectedWith('AbstractMethodInvocationError')

    // static
    expect(AbstractBankFlowMock.convertCSV.bind(AbstractBankFlowMock)).to.throw('AbstractMethodInvocationError')
    expect(AbstractBankFlowMock.accountName.bind(AbstractBankFlowMock)).to.throw('AbstractMethodInvocationError')
  })
})

describe('AbstractBankFlow member functions', () => {
  it('executes downloadCSV correctly', async () => {
    // arrange
    const page = pageMock()
    const flow = abstractBankFlow()
    const fs = flow.fs
    const path = flow.CSV_FOLDER_PATH
    const fileName = testFileName()
    flow.isCSV = sinon.fake.returns(true)

    // act
    const promise = flow.downloadCSV(page, SELECTORS.download)
    await fs.writeFile(`${path}/${fileName}`, 'a,b,c', NOOP)

    // assert
    await promise.then((value) => {
      expect(value).to.equal(fileName)
    })
  })
  it('executes getCSV correctly', async () => {
    // arrange
    const page = pageMock()
    const flow = abstractBankFlow()
    const fileName = testFileName()
    flow.authenticate = sinon.fake.resolves(true)
    flow.navigateToExportTransactions = sinon.fake.resolves(true)
    flow.downloadTransactions = sinon.fake.resolves(fileName)

    // act
    const value = await flow.getCSV(page, null, null)

    // assert
    expect(flow.authenticate.calledOnce).to.be.true
    expect(flow.navigateToExportTransactions.calledOnce).to.be.true
    expect(flow.downloadTransactions.calledOnce).to.be.true
    expect(value).to.equal(fileName)
  })
})
