const { prompt, overwriteDateField } = require('../utils/helpers');
const SECRETS = require('../secrets');
const LoginFlow = require("./shared-login-flow");
const csvConverter = require("../convertCSV/kiwibank2ynab");
const BankFlow = require("./bank-flow");

const URL = "https://www.ib.kiwibank.co.nz/login";
const DATE_FORMAT = "DD/MM/YYYY";

// <div class="question">The name of my first pet?</div> 
// kbf.enhanced_security.esKeyboardInput("b");
// #answer .qa .ex ~.ex .ex .ex ~.ex 
const SELECTORS = {
    login: {
        customerNumberField: "#ctl00_c_txtUserName",
        passwordField: "#ctl00_c_txtPassword",
        loginButton: ".submit_button input",
    },
    onlineCode: {
        onlineCodeField: "#online-code",
        verifyButton: "#verify",
    },
    accounts: {
        "freeUp": "1",
        "cc": "3",
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
}

class KiwibankFlow extends BankFlow {

    constructor() {
        super();
        this.log("KiwibankFlow object created");

    }

    async login(page) {
        this.log("invoked KiwibankFlow::login");

        const loginFlow = new LoginFlow(
            URL,
            SELECTORS.login.customerNumberField,
            SELECTORS.login.passwordField,
            SELECTORS.login.loginButton);
        await loginFlow.login(page, SECRETS.kiwibank.customerNumber, SECRETS.kiwibank.password);

        await prompt('Authorise your login in Chromium');
    }

    async navigateToExportTransactions(page) {
        this.log("invoked KiwibankFlow::navigateToExportTransactions");

        const accountSelector = SELECTORS.accounts.getSelectorForAccount(SELECTORS.accounts.freeUp);
        await page.waitForSelector(accountSelector);
        await page.click(accountSelector);

        await page.waitForSelector(SELECTORS.export.link);
        await page.click(SELECTORS.export.link);

        await page.waitForSelector(SELECTORS.export.selectFormatOpen);
        await page.select(SELECTORS.export.selectFormatOpen, SELECTORS.export.selectFormatCSV);

    }

    async downloadTransactions(page, startMoment, endMoment) {
        this.log(`invoked KiwibankFlow::downloadTransactions`);

        await this.fillDateField(page, SELECTORS.export.startDateField, startMoment);
        await this.fillDateField(page, SELECTORS.export.endDateField, endMoment);

        return super.downloadCSV(page, SELECTORS.export.exportButton);
    }

    async fillDateField(page, selector, mmmoment) {
        this.log("invoked KiwibankFlow::fillDateField");

        // remove readonly attribute from field
        await page.$eval(selector, el => el.removeAttribute("readonly"));

        await overwriteDateField(page, selector, mmmoment, DATE_FORMAT);
    }

}

KiwibankFlow.convertCSV = csvConverter;
KiwibankFlow.accountName = "Kiwibank";
module.exports = KiwibankFlow;
