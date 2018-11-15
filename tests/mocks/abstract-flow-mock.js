const AbstractFlow = require('../../flows/abstract-flow')

class AbstractFlowMock extends AbstractFlow {
  // eslint-disable-next-line no-useless-constructor
  constructor (SECRETS, SELECTORS, urlLogin, urlHome) {
    super(SECRETS, SELECTORS, urlLogin, urlHome)
  }
}

module.exports = AbstractFlowMock
