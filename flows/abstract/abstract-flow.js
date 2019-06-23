require('colors')
const { ClassInitializationError } = require('../../utils/error-classes')
const AbstractLogger = require('./abstract-logger')

class AbstractFlow extends AbstractLogger {
  constructor (SECRETS, SELECTORS, urlLogin, urlHome) {
    if (!SECRETS || !SELECTORS || !urlLogin || !urlHome) {
      throw new ClassInitializationError()
    }
    super()

    this.log('AbstractFlow object created')

    this.SECRETS = SECRETS
    this.SELECTORS = SELECTORS
    this.isAuthenticated = false

    this.urlLogin = urlLogin
    this.urlHome = urlHome
  }

  async authenticate (page) {
    this.log('invoked AbstractFlow::authenticate')
    if (this.isAuthenticated === false) {
      this.isAuthenticated = await this.__login(page, this.SECRETS.userID, this.SECRETS.password, this.SELECTORS.login)
      return this.isAuthenticated
    } else {
      this.log('    re-using existing session')
      await page.goto(this.urlHome)
      await page.waitForNavigation()
      return true
    }
  }

  async __login (page, userID, password, loginSelectors) {
    this.info('invoked AbstractFlow::login')
    if (!userID) {
      this.log(`    No userID supplied, could not login`)
      return false
    }
    this.info(`    logging in user ${userID}`)

    await page.goto(this.urlLogin)
    await page.waitForSelector(loginSelectors.userIDField)

    await page.click(loginSelectors.userIDField)
    await page.keyboard.type(userID)

    await page.click(loginSelectors.passwordField)
    await page.keyboard.type(password)

    await page.click(loginSelectors.loginButton)
    await page.waitForNavigation()
    return true
  }
}

module.exports = AbstractFlow
