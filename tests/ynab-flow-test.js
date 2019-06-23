const { expect, assert } = require('./helpers/setup-chai')
const { YNABFlow, ynabAccounts } = require('../flows/ynab/ynab-flow')
const ynabApiMock = require('./mocks/ynab-api-mock')

const DATA = {
  budgetId: 'this id a very special my budget id for testing',
  accountName: ynabAccounts.ANZ.name,
  accountId: 'id for ANZ Current 00',
  date: '2019-01-11',
}

describe('YNABFlow', () => {
  describe('Constructor', () => {
    it('instantiates', () => {
      // act
      const flow = new YNABFlow(ynabApiMock)

      // assert
      expect(flow instanceof YNABFlow).to.be.true
    })
  })
  describe('Data Structures', () => {
    it('gets the budget ID', async () => {
      // arrange
      const flow = new YNABFlow(ynabApiMock)

      // act
      const budgetId = await flow.getBudgetId()

      // assert
      expect(budgetId).to.equal(DATA.budgetId)
    })
    it('looks up an account ID on name', async () => {
      // arrange
      const flow = new YNABFlow(ynabApiMock)
      const budgetId = await flow.getBudgetId()

      // act
      const accountId = await flow.getAccountId(budgetId, DATA.accountName)

      // assert
      expect(accountId).to.equal(DATA.accountId)
    })
    it('gets the most recent transaction for an IDs', async () => {
      // arrange
      const flow = new YNABFlow(ynabApiMock)
      const budgetId = await flow.getBudgetId()
      const accountId = await flow.getAccountId(budgetId, DATA.accountName)

      // act
      const transaction = await flow.getMostRecentTransaction(budgetId, accountId)

      // assert
      expect(transaction.date).to.equal(DATA.date)
    })
    it.skip('imports a list of transactions for an ID', () => {
    })
  })
})
