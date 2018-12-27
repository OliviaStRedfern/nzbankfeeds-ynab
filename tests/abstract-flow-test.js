const { expect } = require('./helpers/setup-chai')
const AbstractFlowMock = require('./mocks/abstract-flow-mock')
const pageMock = require('./mocks/page-mock')
const { SECRETS, SELECTORS, urlLogin, urlHome } = require('./mocks/config-mock')

const flowMock = () => {
  return new AbstractFlowMock(SECRETS, SELECTORS, urlLogin, urlHome)
}

describe('AbstractFlow', () => {
  describe('Constructor', () => {
    it('instantiates', () => {
      // act
      const flow = flowMock()

      // assert
      expect(flow instanceof AbstractFlowMock).to.be.true
    })
    it('does not allow instantiation without valid parameters', () => {
      // assert
      expect(() => new AbstractFlowMock()).to.throw('ClassInitializationError')
      expect(() => new AbstractFlowMock(null, null, null, null)).to.throw('ClassInitializationError')
    })
  })

  describe('Logging Into a Web Site', () => {
    it('goes to the correct url and then simulates clicks and typing to login', async () => {
      const page = pageMock()
      const flow = flowMock()
      const result = await flow.__login(page, SECRETS.userID, SECRETS.password, SELECTORS.login)
      expect(result).to.be.true
      expect(page.goto.alwaysCalledWithExactly(urlLogin)).to.be.true
      expect(page.click.calledThrice).to.be.true
      expect(page.keyboard.type.calledTwice).to.be.true
      expect(page.waitForNavigation.calledOnce).to.be.true
    })

    it('fails authentication if no username is provided', async () => {
      const page = pageMock()
      const flow = flowMock()
      const result = await flow.__login(page, '', SECRETS.password)
      expect(result).to.be.false
    })

    it('authenticates, or reuses a session if available', async () => {
      const page = pageMock()
      const flow = flowMock()
      expect(flow.isAuthenticated).to.be.false

      const result1 = await flow.authenticate(page)
      expect(result1).to.be.true
      expect(flow.isAuthenticated).to.be.true
      expect(page.goto.calledWith(urlLogin)).to.be.true
      expect(page.goto.calledWith(urlHome)).to.be.false
      expect(page.click.calledThrice).to.be.true
      expect(page.waitForNavigation.calledOnce).to.be.true

      const result2 = await flow.authenticate(page)
      expect(result2).to.be.true
      expect(page.goto.calledWith(urlHome)).to.be.true
      expect(page.click.calledThrice).to.be.true
      expect(page.waitForNavigation.calledTwice).to.be.true
    })
  })
})
