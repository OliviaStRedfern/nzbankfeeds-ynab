const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const { expect, assert } = chai
const { YNABFlow } = require('../flows/ynab/ynab-flow')
const { SELECTORS } = require('./mocks/config-mock')

const secretsMock = {
  userID: 'somethung',
  password: 'whatuver'
}

describe('can instantiate', () => {
  it('instantiates', () => {
    // act
    const flow = new YNABFlow(secretsMock)

    // assert
    expect(flow instanceof YNABFlow).to.be.true
  })
  it('does not allow instantiation without valid parameters', () => {
    // assert
    expect(() => new YNABFlow()).to.throw('ClassInitializationError')
    expect(() => new YNABFlow(null)).to.throw('ClassInitializationError')
  })
})
describe('data structures', () => {
  it('has correct selectors', () => {
    // act
    const flow = new YNABFlow(secretsMock)

    // assert
    assert.deepEqual(Object.keys(flow.SELECTORS.login), Object.keys(SELECTORS.login))
  })
})
