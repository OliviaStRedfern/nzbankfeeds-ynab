const AbstractBankFlow = require('../../flows/abstract-bank-flow')
class AbstractBankFlowMock extends AbstractBankFlow {
  // eslint-disable-next-line no-useless-constructor
  constructor (SECRETS, SELECTORS, urlLogin, urlHome) {
    super(SECRETS, SELECTORS, urlLogin, urlHome)
  }
}

module.exports = AbstractBankFlowMock
