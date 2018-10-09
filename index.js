// const ANZFlow = require("./flows/anz-flow");
// const BNZFlow = require("./flows/bnz-flow");
// const KiwibankCCFlow = require("./flows/kiwibank-cc-flow");
// const KiwibankFlow = require("./flows/kiwibank-flow");
// const WestpacFlow = require("./flows/westpac-flow");
// const WestpacCCFlow = require("./flows/westpac-cc-flow");
// const { YNABFlow } = require("./flows/ynab-flow");
const moment = require("moment");
const launchBrowser = require("./utils/launch-browser");
const getFlow = require("./flows/flow-factory");

async function main(bankFlow) {
    const ynab = getFlow("ynab-flow");
    const bank = getFlow(bankFlow);

    const pageBank = await launchBrowser();
    const pageYNAB = await launchBrowser();

    const todayMoment = moment();
    const mostRecentTransactionMoment =
        await ynab.getMostRecentTransactionMoment(pageYNAB, bank.ynabAccount);
    const fileName = await bank.getCSV(pageBank, mostRecentTransactionMoment, todayMoment);
    const ynabCSV = await bank.csvConvert(fileName);
    await bank.logout(pageBank);

    await ynab.gotoHome(pageYNAB);
    await ynab.uploadCSV(pageYNAB, bank.ynabAccount, ynabCSV);
}

main("anz-flow");



