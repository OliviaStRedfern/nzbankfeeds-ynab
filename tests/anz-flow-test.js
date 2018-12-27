const { expect, assert } = require('./helpers/setup-chai')
const sinon = require('sinon')
const ANZFlow = require('../flows/bank/anz-flow')
const AbstractFlow = require('../flows/abstract/abstract-flow')
const AbstractBankFlow = require('../flows/abstract/abstract-bank-flow')
const { SELECTORS, SECRETS, YNAB_ACCOUNT_SELECTOR } = require('./mocks/config-mock')
const pageMock = require('./mocks/page-mock')

describe('can instantiate', () => {
  it('instantiates', () => {
    // act
    const flow = new ANZFlow(SECRETS)

    // assert
    expect(flow instanceof ANZFlow).to.be.true
  })
  it('does not allow instantiation without valid parameters', () => {
    // assert
    expect(() => new ANZFlow()).to.throw('ClassInitializationError')
    expect(() => new ANZFlow(null)).to.throw('ClassInitializationError')
  })
})

describe('data structures', () => {
  it('has correct selectors', () => {
    // act
    const flow = new ANZFlow(SECRETS)

    // assert
    assert.containsAllDeepKeys(flow.SELECTORS, SELECTORS)
    assert.hasAllDeepKeys(flow.SELECTORS.login, SELECTORS.login)
    assert.hasAllDeepKeys(flow.ynabAccount, YNAB_ACCOUNT_SELECTOR)
    assert.isFunction(flow.csvConvert)
  })
})

describe('implementation', () => {
  afterEach(() => {
    sinon.restore()
  })

  it('login', async () => {
    // arrange
    const flow = new ANZFlow(SECRETS)
    const page = pageMock()
    const authenticateFake = sinon.fake.resolves(true)
    sinon.replace(AbstractFlow.prototype, 'authenticate', authenticateFake)
    flow.prompt = sinon.fake()

    // act
    await flow.authenticate(page)

    // assert
    expect(authenticateFake.calledOnce).to.be.true
  })

  it('navigateToExportTransactions', async () => {
    // arrange
    const flow = new ANZFlow(SECRETS)
    const page = pageMock()

    // act
    await flow.navigateToExportTransactions(page)

    // assert
    expect(page.click.called).to.be.true
  })

  it('downloadTransactions', async () => {
    // arrange
    const flow = new ANZFlow(SECRETS)
    const page = pageMock()
    const downloadCSVFake = sinon.fake.resolves(true)
    const fillDateFieldFake = sinon.fake.resolves(true)
    sinon.replace(AbstractBankFlow.prototype, 'downloadCSV', downloadCSVFake)
    sinon.replace(ANZFlow.prototype, 'fillDateField', fillDateFieldFake)

    // act
    await flow.downloadTransactions(page)

    // assert
    expect(downloadCSVFake.called).to.be.true
    expect(fillDateFieldFake.called).to.be.true

    // @todo test this bitch DATE_FORMAT
  })
})
