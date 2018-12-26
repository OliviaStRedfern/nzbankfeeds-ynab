// eslint-disable-next-line no-unused-vars
const colors = require('colors')

class AbstractFlow {
  constructor (SECRETS, SELECTORS, urlLogin, urlHome) {
    this.log('AbstractFlow object created')

    this.SECRETS = SECRETS
    this.SELECTORS = SELECTORS
    this.isAuthenticated = false

    // Can be overridden if the URL doesn't redirect to the home page
    this.urlLogin = urlLogin
    this.urlHome = urlHome
  }

  log (message) {
    console.log(message.magenta)
  }

  async authenticate (page) {
    this.log('invoked AbstractFlow::authenticate')
    if (this.isAuthenticated === false) {
      this.isAuthenticated = await this.login(page, this.SECRETS.userID, this.SECRETS.password)
      return this.isAuthenticated
    } else {
      this.log('    re-using existing session')
      await page.goto(this.urlHome)
      await page.waitForNavigation()
      return true
    }
  }

  async login (page, username, password) {
    this.log('invoked AbstractFlow::login')
    if (username.length === 0) {
      console.error(`    No username supplied, could not login`)
      return false
    }
    console.log(`    logging in user ${username}`)

    await page.goto(this.urlLogin)

    await page.click(this.usernameField)
    await page.keyboard.type(username)

    await page.click(this.passwordField)
    await page.keyboard.type(password)

    await page.click(this.submitButton)
    await page.waitForNavigation()
    return true
  }
}

module.exports = AbstractFlow
