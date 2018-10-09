const moment = require("moment");
const launchBrowser = require("./utils/launch-browser");
const getFlow = require("./flows/flow-factory");

async function run(obj) {
    
    const {bank, ynab, pageBank, pageYNAB} = obj;

    const todayMoment = moment();
    const mostRecentTransactionMoment =
        await ynab.getMostRecentTransactionMoment(pageYNAB, bank.ynabAccount);
    const fileName = await bank.getCSV(pageBank, mostRecentTransactionMoment, todayMoment);
    const ynabCSV = await bank.csvConvert(fileName);
    await bank.logout(pageBank);

    await ynab.gotoHome(pageYNAB);
    await ynab.uploadCSV(pageYNAB, bank.ynabAccount, ynabCSV);
}

async function main() {
    const flows = [
        // "anz-flow",
        // "bnz-flow",
        // "kiwibank-cc-flow",
        // "kiwibank-flow",
        // "westpac-flow",
        "westpac-cc-flow"
    ]

    let bank;
    let pageBank;
    const ynab = getFlow("ynab-flow");
    const pageYNAB = await launchBrowser();
    const obj = { bank, ynab, pageBank, pageYNAB };
    for (let i = 0; i < flows.length; i++) {
        obj.bank = getFlow(flows[i]);
        obj.pageBank = await launchBrowser();
        await run(obj);
        obj.pageBank.close();
    }
}

main();


