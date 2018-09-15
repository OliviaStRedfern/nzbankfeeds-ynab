const ANZFlow = require("./flows/anz-flow");
const BNZFlow = require("./flows/bnz-flow");
const KiwibankFlow = require("./flows/kiwibank-flow");
const YNABFlow = require("./flows/ynab-flow");
const moment = require("moment");
const launchBrowser = require("./utils/launch-browser");

async function main(BankFlow) {
    const ynab = new YNABFlow();
    // const bank = new BankFlow();
    const account = BankFlow.accountName;
    // const pageBank = await launchBrowser();
    const pageYNAB = await launchBrowser();

    const todayMoment = moment();
    const mostRecentTransactionMoment =
        await ynab.getMostRecentTransactionMoment(pageYNAB, YNABFlow.accounts[account]);
    // const fileName = await bank.getCSV(pageBank, mostRecentTransactionMoment, todayMoment);
    const fileName = "/Users/conradjohnston/Downloads/YNAB-38-9019-0382142-00_16Sep (8).CSV";
    // BankFlow.convertCSV(fileName);
    // await bank.logout(pageBank);

    await ynab.gotoHome(pageYNAB);
    await ynab.uploadCSV(pageYNAB, YNABFlow.accounts[account], fileName);
}

main(KiwibankFlow);



