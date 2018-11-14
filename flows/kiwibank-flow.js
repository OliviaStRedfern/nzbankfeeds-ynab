const { prompt, overwriteDateField } = require('../utils/helpers');
const AbstractBankFlow = require("./abstract-bank-flow");
const csvConvert =  require("../convertCSV/kiwibank2ynab");;
const { ynabAccounts } = require("./ynab-flow")

// <div class="question">The name of my first pet?</div> 
// kbf.enhanced_security.esKeyboardInput("b");
// #answer .qa .ex ~.ex .ex .ex ~.ex 


class KiwibankFlow extends AbstractBankFlow {

    constructor(secrets) {
        super();
        this.log("KiwibankFlow object created");
        this.ynabAccount = ynabAccounts.Kiwibank;
        this.csvConvert = csvConvert;
        this.SECRETS = secrets;
        this.URL = "https://www.ib.kiwibank.co.nz/accounts/";
        this.SELECTORS = {
            login: {
                userIDField: "#ctl00_c_txtUserName",
                passwordField: "#ctl00_c_txtPassword",
                loginButton: ".submit_button input",
            },
            onlineCode: {
                onlineCodeField: "#online-code",
                verifyButton: "#verify",
            },
            accounts: {
                "freeUp": "1",
                "cc": "4",
                getSelectorForAccount(accountType) {
                    return `#account_list tr:nth-child(${accountType}) td.account_title a`
                }
            },
            export: {
                link: "a.advanced.open",
                selectFormatOpen: "#ctl00_c_TransactionSearchControl_ExportFormats_List",
                selectFormatCSV: "CSV-Extended",
                startDateField: "#ctl00_c_TransactionSearchControl_DualDateSelector_initialDate_TextBox",
                endDateField: "#ctl00_c_TransactionSearchControl_DualDateSelector_finalDate_TextBox",
                exportButton: "#ctl00_c_TransactionSearchControl_ActionButton",
            },
            logout: {
                menu: "button.MenuButton",
                logoutButton: "button.js-main-menu-logout",
            }
        };
    }

    async login(page) {
        this.log("invoked KiwibankFlow::login");

        if (await super.login(page) ) {
            await prompt('Authorise your login in Chromium then press enter ');
        }
    }

    getAccountSelector() {
        return this.SELECTORS.accounts.getSelectorForAccount(this.SELECTORS.accounts.freeUp);
    }

    async navigateToExportTransactions(page) {
        this.log("invoked KiwibankFlow::navigateToExportTransactions");

        const accountSelector = this.getAccountSelector();
        await page.waitForSelector(accountSelector);
        await page.click(accountSelector);

        await page.waitForSelector(this.SELECTORS.export.selectFormatOpen);

        await page.click(this.SELECTORS.export.link);

        await page.waitForSelector(this.SELECTORS.export.selectFormatOpen);
        await page.select(this.SELECTORS.export.selectFormatOpen, this.SELECTORS.export.selectFormatCSV);

    }

    async downloadTransactions(page, startMoment, endMoment) {
        this.log(`invoked KiwibankFlow::downloadTransactions`);

        await this.fillDateField(page, this.SELECTORS.export.startDateField, startMoment);
        await this.fillDateField(page, this.SELECTORS.export.endDateField, endMoment);

        return super.downloadCSV(page, this.SELECTORS.export.exportButton);
    }

    async fillDateField(page, selector, mmmoment) {
        this.log("invoked KiwibankFlow::fillDateField");

        // remove readonly attribute from field
        await page.$eval(selector, el => el.removeAttribute("readonly"));

        await overwriteDateField(page, selector, mmmoment, this.DATE_FORMAT);
    }

}

module.exports = KiwibankFlow;
