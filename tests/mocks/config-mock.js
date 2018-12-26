const SECRETS = {
  userID: 'userID',
  password: 'password'
}
const SELECTORS = {
  login: {
    userIDField: 'userIDField',
    passwordField: 'passwordField',
    loginButton: 'loginButton'
  }
}
const urlLogin = 'mock://login'
const urlHome = 'mock://home'

module.exports = { SECRETS, SELECTORS, urlLogin, urlHome }
