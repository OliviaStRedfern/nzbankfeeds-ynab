const { prompt, wait, overwriteDateField } = require('../utils/helpers');
const AbstractBankFlow = require("./abstract-bank-flow");
const SECRETS = require('../secrets');
const csvConvert = require("../convertCSV/westpac2ynab");
const { ynabAccounts } = require("./ynab-flow")
class WestpacFlow extends AbstractBankFlow {

    constructor() {
        super();
        this.log("WestpacFlow object created");
        this.ynabAccount = ynabAccounts.Westpac;
        this.csvConvert = csvConvert;
        this.SECRETS = SECRETS.WestpacFlow;
        this.URL = "https://bank.westpac.co.nz/one/app.html#accounts";
        this.SELECTORS = {
            login: {
                userIDField: "#login-username",
                passwordField: "#login-password",
                loginButton: "#action-login",
            },
            accounts: {
                everyday: "1",
                cc: "2",
                getSelectorForAccount(accountType) {
                    return `#accounts-list li:nth-child(${accountType}) a`
                }
            },
            export: {
                link: "a.action-export",
                continue: "#download-transaction-dialog > div > h2",
                startDateField: ".from-datepicker-region input",
                endDateField: ".to-datepicker-region input",
                exportButton: "#action-export",
            }
        };        
    }

    async login(page) {
        this.log("invoked WestpacFlow::login");

        await super.login(page);

        const onlineCode = await prompt('Do whatever with online guardian (maybe nothing)');

    }

    getAccountSelector() {
        return this.SELECTORS.accounts.getSelectorForAccount(this.SELECTORS.accounts.everyday);
    }

    async navigateToExportTransactions(page) {
        this.log("invoked WestpacFlow::navigateToExportTransactions");

        await page.waitForSelector(this.getAccountSelector());
        await page.click(this.getAccountSelector());

        await page.waitForSelector(this.SELECTORS.export.link);
        await page.click(this.SELECTORS.export.link);

    }

    async downloadTransactions(page, startMoment, endMoment) {
        this.log(`invoked WestpacFlow::downloadTransactions`);

        await this.fillDateField(page, this.SELECTORS.export.startDateField, startMoment);
        await this.fillDateField(page, this.SELECTORS.export.endDateField, endMoment);

        await page.click(this.SELECTORS.export.continue);

        return super.downloadCSV(page, this.SELECTORS.export.exportButton);
    }

    async fillDateField(page, selector, mmmoment) {
        this.log("invoked WestpacFlow::fillDateField");
        await overwriteDateField(page, selector, mmmoment, this.DATE_FORMAT);
    }

}

module.exports = WestpacFlow;
