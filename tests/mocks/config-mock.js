const SECRETS = {
  userID: 'userID',
  password: 'password',
}
const SELECTORS = {
  login: {
    userIDField: 'userIDField',
    passwordField: 'passwordField',
    loginButton: 'loginButton',
  },
  accounts: {
    getSelectorForAccount (accountType) {
      return `#SelectorForAccount_${accountType}`
    },
  },
  export: {
    link: 'exportLink',
  },
}
const urlLogin = 'mock://login'
const urlHome = 'mock://home'
const YNAB_ACCOUNT_SELECTOR = {
  name: 'Current Account',
}
module.exports = { SECRETS, SELECTORS, YNAB_ACCOUNT_SELECTOR, urlLogin, urlHome }
