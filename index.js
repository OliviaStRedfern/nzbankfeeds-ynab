const moment = require('moment')
const launchBrowser = require('./utils/launch-browser')
const getFlow = require('./flows/flow-factory')

async function run (context) {
  const { bank, ynab, pageBank, pageYNAB } = context
  const mostRecentTransactionMoment =
        await ynab.getMostRecentTransactionMoment(pageYNAB, bank.ynabAccount)
  if (mostRecentTransactionMoment !== null) {
    await downloadTransactions(context, mostRecentTransactionMoment)
  }
  await bank.logout(pageBank)
}

async function downloadTransactions (context, mostRecentTransactionMoment) {
  const { bank, pageBank } = context
  const todayMoment = moment()
  const fileName = await bank.getCSV(pageBank, mostRecentTransactionMoment, todayMoment)
  // if (fileName) {
  await uploadTransactions(context, fileName)
  // }
}

async function uploadTransactions (context, fileName) {
  const { bank, ynab, pageYNAB } = context
  const ynabCSV = await bank.csvConvert(fileName)
  await ynab.gotoHome(pageYNAB)
  await ynab.uploadCSV(pageYNAB, bank.ynabAccount, ynabCSV)
}

async function main () {
  const flows = [
    // 'kiwibank-cc-flow',
    // 'kiwibank-flow',
    // 'anz-flow',
    'bnz-flow',
    // 'westpac-flow',
    // 'westpac-cc-flow',
  ]

  let bank
  let pageBank
  const ynab = getFlow('ynab-flow')
  const webYNAB = await launchBrowser()
  const pageYNAB = webYNAB.page
  const context = { bank, ynab, pageBank, pageYNAB }
  for (let i = 0; i < flows.length; i++) {
    context.bank = getFlow(flows[i])
    let webBank = await launchBrowser()
    context.pageBank = webBank.page
    await run(context)
    await webBank.browser.close()
  }
}

main()
