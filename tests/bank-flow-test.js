const { expect, assert } = require('./helpers/setup-chai')
const sinon = require('sinon')
const AbstractFlow = require('../flows/abstract/abstract-flow')
const AbstractBankFlow = require('../flows/abstract/abstract-bank-flow')
const { SELECTORS, SECRETS, YNAB_ACCOUNT_SELECTOR } = require('./mocks/config-mock')
const pageMock = require('./mocks/page-mock')

const flowRequires = [
  'anz-flow',
  'bnz-flow',
  'kiwibank-cc-flow',
  'kiwibank-flow',
  'westpac-flow',
  'westpac-cc-flow',
]

for (let i = 0; i < flowRequires.length; i++) {
  let FlowClass = require(`../flows/bank/${flowRequires[i]}`)

  describe(FlowClass.name, () => {
    describe('Constructor', () => {
      it('instantiates', () => {
        // act
        const flow = new FlowClass(SECRETS)

        // assert
        expect(flow instanceof FlowClass).to.be.true
      })
      it('does not allow instantiation without valid parameters', () => {
        // assert
        expect(() => new FlowClass()).to.throw('ClassInitializationError')
        expect(() => new FlowClass(null)).to.throw('ClassInitializationError')
      })
    })

    describe('Data Structures', () => {
      it('has correct selectors', () => {
        // act
        const flow = new FlowClass(SECRETS)

        // assert
        assert.containsAllDeepKeys(flow.SELECTORS, SELECTORS)
        assert.hasAllDeepKeys(flow.SELECTORS.login, SELECTORS.login)
        assert.hasAllDeepKeys(flow.ynabAccount, YNAB_ACCOUNT_SELECTOR)
        assert.isFunction(flow.csvConvert)
      })
      it('reports the correct filename', () => {
        // act
        const flow = new FlowClass(SECRETS)

        const reportedFilename = flow.__filename.split("/").pop()
        const expectedFilename = `${flowRequires[i]}.js`
        expect(reportedFilename).to.equal(expectedFilename)
      })
    })
    describe('Implementation', () => {
      afterEach(() => {
        sinon.restore()
      })

      it('authenticates', async () => {
        // arrange
        const flow = new FlowClass(SECRETS)
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
        const flow = new FlowClass(SECRETS)
        const page = pageMock()

        // act
        await flow.navigateToExportTransactions(page)

        // assert
        expect(page.click.called).to.be.true
      })

      it('downloadTransactions', async () => {
        // arrange
        const flow = new FlowClass(SECRETS)
        const page = pageMock()
        const downloadCSVFake = sinon.fake.resolves(true)
        const fillDateFieldFake = sinon.fake.resolves(true)
        sinon.replace(AbstractBankFlow.prototype, 'downloadCSV', downloadCSVFake)
        sinon.replace(FlowClass.prototype, 'fillDateField', fillDateFieldFake)

        // act
        await flow.downloadTransactions(page)

        // assert
        expect(downloadCSVFake.called).to.be.true
        expect(fillDateFieldFake.called).to.be.true
      })
    })
  })
}
