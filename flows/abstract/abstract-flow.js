require('colors')
const { ClassInitializationError } = require('../../utils/error-classes')

class AbstractFlow {
  constructor (SECRETS, SELECTORS, urlLogin, urlHome) {
    if (!SECRETS || !SELECTORS || !urlLogin || !urlHome) {
      throw new ClassInitializationError()
    }
    this.log('AbstractFlow object created')

    this.SECRETS = SECRETS
    this.SELECTORS = SELECTORS
    this.isAuthenticated = false

    this.urlLogin = urlLogin
    this.urlHome = urlHome
  }

  log (message) {
    console.log(message.magenta)
  }

  async authenticate (page) {
    this.log('invoked AbstractFlow::authenticate')
    if (this.isAuthenticated === false) {
      console.dir(this.SECRETS)
      this.isAuthenticated = await this.login(page, this.SECRETS.userID, this.SECRETS.password)
      return this.isAuthenticated
    } else {
      this.log('    re-using existing session')
      await page.goto(this.urlHome)
      await page.waitForNavigation()
      return true
    }
  }

  async login (page, userID, password) {
    this.log('invoked AbstractFlow::login')
    if (!userID) {
      console.error(`    No userID supplied, could not login`)
      return false
    }
    console.log(`    logging in user ${userID}`)

    await page.goto(this.urlLogin)

    await page.click(this.usernameField)
    await page.keyboard.type(userID)

    await page.click(this.passwordField)
    await page.keyboard.type(password)

    await page.click(this.submitButton)
    await page.waitForNavigation()
    return true
  }
}

module.exports = AbstractFlow
