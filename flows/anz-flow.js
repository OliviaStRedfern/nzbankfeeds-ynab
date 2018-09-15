const { prompt, wait, overwriteDateField } = require('../utils/helpers');
const SECRETS = require('../secrets');
const LoginFlow = require("./shared-login-flow");
const csvConverter = require("../convertCSV/anz2ynab");
const BankFlow = require("./bank-flow");

const URL = "https://digital.anz.co.nz/preauth/web/service/login";
const DATE_FORMAT = "DD/MM/YYYY";
const SELECTORS = {
    login: {
        customerNumberField: "#user-id",
        passwordField: "#password",
        loginButton: "#submit",
    },
    onlineCode: {
        onlineCodeField: "#online-code",
        verifyButton: "#verify",
    },
    accounts: {
        cheque: "im",
        loan: "loan",
        kiwisaver: "investment",
        getSelectorForAccount(accountType) {
            return `.account-group.${accountType} h3.account-name a`
        }
    },
    export: {
        link: "#transactions-export-panel-toggle",
        animationDelay: 1000,
        startDateField: "input[name=start-date]",
        endDateField: "input[name=end-date]",
        exportButton: "#transaction-export-submit",
    }
}

class ANZFlow extends BankFlow {

    constructor() {
        super();
        this.log("ANZFlow object created");

    }

    async login(page) {
        this.log("invoked ANZFlow::login");

        const loginFlow = new LoginFlow(
            URL,
            SELECTORS.login.customerNumberField,
            SELECTORS.login.passwordField,
            SELECTORS.login.loginButton);
        await loginFlow.login(page, SECRETS.anz.customerNumber, SECRETS.anz.password);

        const onlineCode = await prompt('Enter your online code: ');

        await page.click(SELECTORS.onlineCode.onlineCodeField);
        await page.keyboard.type(onlineCode);

        await page.click(SELECTORS.onlineCode.verifyButton);
        await page.waitForNavigation();
    }

    async navigateToExportTransactions(page) {
        this.log("invoked ANZFlow::navigateToExportTransactions");

        await page.waitForSelector(SELECTORS.accounts.getSelectorForAccount(SELECTORS.accounts.cheque));
        await page.click(SELECTORS.accounts.getSelectorForAccount(SELECTORS.accounts.cheque));

        await page.waitForSelector(SELECTORS.export.link);
        await page.click(SELECTORS.export.link);

        await wait(SELECTORS.export.animationDelay);
    }

    async downloadTransactions(page, startMoment, endMoment) {
        this.log(`invoked ANZFlow::downloadTransactions`);

        await this.fillDateField(page, SELECTORS.export.startDateField, startMoment);
        await this.fillDateField(page, SELECTORS.export.endDateField, endMoment);

        return super.downloadCSV(page, SELECTORS.export.exportButton);
    }

    async fillDateField(page, selector, mmmoment) {
        this.log("invoked ANZFlow::fillDateField");
        overwriteDateField(page, selector, mmmoment, DATE_FORMAT);
    }

}

ANZFlow.convertCSV = csvConverter;
ANZFlow.accountName = "ANZ";
module.exports = ANZFlow;
