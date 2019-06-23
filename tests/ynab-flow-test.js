const { expect, assert } = require('./helpers/setup-chai')
const { YNABFlow } = require('../flows/ynab/ynab-flow')
const { SELECTORS, SECRETS } = require('./mocks/config-mock')

describe('YNABFlow', () => {
  describe('Constructor', () => {
    it('instantiates', () => {
      // act
      const flow = new YNABFlow()

      // assert
      expect(flow instanceof YNABFlow).to.be.true
    })
  })
  describe('Data Structures', () => {
    it.skip('gets the budget ID', () => {
    })
    it.skip('gets a list of account IDs', () => {
    })
    it.skip('gets the most recent transaction for an IDs', () => {
    })
    it.skip('imports a list of transactions for an ID', () => {
    })
  })
})
