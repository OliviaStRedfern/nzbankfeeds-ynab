const SECRETS = require('../secrets');
const LoginFlow = require("./shared-login-flow");
const moment = require("moment");
const colors = require("colors");
const { prompt } = require("../utils/helpers");

const ANZ = {
    selector: ".nav-accounts .nav-account.onBudget a.nav-account-row:nth-of-type(6)"
}
const BNZ = {
    selector: ".nav-accounts .nav-account.onBudget a.nav-account-row:nth-of-type(3)"
}
const Kiwibank = {
    selector: ".nav-accounts .nav-account.onBudget a.nav-account-row:nth-of-type(1)"
}
const KiwibankCC = {
    selector: ".nav-accounts .nav-account.onBudget a.nav-account-row:nth-of-type(5)"
}

const ynabAccounts = {
    ANZ, BNZ, Kiwibank, KiwibankCC
}

const URLS = {
    login: "https://app.youneedabudget.com/users/login",
    home: "https://app.youneedabudget.com"
}
const SELECTORS = {
    login: {
        usernameField: "#login-username",
        passwordField: "#login-password",
        loginButton: "button[type=submit]",
    },
    import: {
        transactionDates: ".content .ynab-grid-body-row:not(.is-scheduled):not(.needs-approved) .ynab-grid-cell-date",
        startImportButton: "button.accounts-toolbar-file-import-transactions",
        animationDelay: 200,
        choseImportFile: "input[type=file]",
    },
};

class YNABFlow {

    constructor() {
        this.log("YNABFlow object created");
    }

    log(message) {
        console.log(message.dim);
    }

    async login(page) {
        this.log("invoked YNABFlow::login");

        const loginFlow = new LoginFlow(
            URLS.login,
            SELECTORS.login.usernameField,
            SELECTORS.login.passwordField,
            SELECTORS.login.loginButton);
        await loginFlow.login(page, SECRETS.ynab.username, SECRETS.ynab.password);
    }

    async getMostRecentTransactionMoment(page, ynabAccount) {
        this.log("invoked YNABFlow::getMostRecentTransactionDate");

        await this.login(page);
        await page.click(ynabAccount.selector);
        const transactionDateElements = await page.$$(SELECTORS.import.transactionDates);
        const mostRecentTransactionUSDate = await page.evaluate(
            el => el.innerText.trim(), transactionDateElements[0]
        );

        console.log(`    found YNAB most recent transaction date ${mostRecentTransactionUSDate}`.green);

        const mostRecentTransactionMoment = moment(mostRecentTransactionUSDate, "MM-DD-YYYY");

        return mostRecentTransactionMoment;
    }

    async uploadCSV(page, ynabAccount, fileName) {
        this.log("invoked YNABFlow::uploadCSV");
        this.log(`    file: ${fileName}`);

        await page.waitForSelector(ynabAccount.selector);
        await page.click(ynabAccount.selector);
        await page.click(SELECTORS.import.startImportButton);
        await page.waitForSelector(SELECTORS.import.choseImportFile);
        const elementHandle = await page.$(SELECTORS.import.choseImportFile);

        await elementHandle.uploadFile(fileName);

        await prompt('Confirm the import in Chromium');
    }
    async gotoHome(page) {
        await page.goto(URLS.home);
    }
}

module.exports = { YNABFlow, ynabAccounts };