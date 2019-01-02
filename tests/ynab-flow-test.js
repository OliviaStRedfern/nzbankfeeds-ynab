const { expect, assert } = require('./helpers/setup-chai')
const { YNABFlow } = require('../flows/ynab/ynab-flow')
const { SELECTORS, SECRETS } = require('./mocks/config-mock')

describe('YNABFlow', () => {
  describe('Constructor', () => {
    it('instantiates', () => {
      // act
      const flow = new YNABFlow(SECRETS)

      // assert
      expect(flow instanceof YNABFlow).to.be.true
    })
    it('does not allow instantiation without valid parameters', () => {
      // assert
      expect(() => new YNABFlow()).to.throw('ClassInitializationError')
      expect(() => new YNABFlow(null)).to.throw('ClassInitializationError')
    })
  })
  describe('Data Structures', () => {
    it('has correct selectors', () => {
      // act
      const flow = new YNABFlow(SECRETS)

      // assert
      assert.deepEqual(Object.keys(flow.SELECTORS.login), Object.keys(SELECTORS.login))
    })
  })
})
