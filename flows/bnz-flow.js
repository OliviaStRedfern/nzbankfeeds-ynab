const { prompt, isSelectorVisible } = require('../utils/helpers');
const SECRETS = require('../secrets');
const LoginFlow = require("./shared-login-flow");
const moment = require("moment");
const csvConverter = require("../convertCSV/bnz2ynab");
const BankFlow = require("./bank-flow");

const URL = "https://secure.bnz.co.nz/auth/personal-login";
const DATE_FORMAT = "DD/MM/YYYY";



const SELECTORS = {
    login: {
        customerNumberField: "#field-principal",
        passwordField: "#field-credentials",
        loginButton: "form button",
    },
    onlineCode: {
        onlineCodeField: "#online-code",
        verifyButton: "#verify",
    },
    accounts: {
        closePromo: ".intercom-note-close",
        cc: "CreditCardDetailsView",
        getSelectorForAccount(accountType) {
            return `.transactions-panel .${accountType}`
        }
    },
    export: {
        link: "button.js-export",
        selectFormatOpen: "input#ComboboxInput-export-format",
        selectFormatCSV: "a[href=\\#CSV]",
        startDateField: "input#fromDate",
        endDateField: "input#toDate",
        exportButton: "button.js-submit",
    },
    logout: {
        menu: "button.MenuButton",
        logoutButton: "button.js-main-menu-logout",
    }
}

class BNZFlow extends BankFlow {

    constructor() {
        super();
        this.log("BNZFlow object created");

    }

    async login(page) {
        this.log("invoked BNZFlow::login");

        const loginFlow = new LoginFlow(
            URL,
            SELECTORS.login.customerNumberField,
            SELECTORS.login.passwordField,
            SELECTORS.login.loginButton);
        await loginFlow.login(page, SECRETS.bnz.customerNumber, SECRETS.bnz.password);

        await prompt('Authorise your login using your device, then press enter');
    }

    async navigateToExportTransactions(page) {
        this.log("invoked BNZFlow::navigateToExportTransactions");

        if (await isSelectorVisible(page, SELECTORS.accounts.closePromo)) {
            await page.click(SELECTORS.accounts.closePromo);
        }

        await page.waitForSelector(SELECTORS.accounts.getSelectorForAccount(SELECTORS.accounts.cc));

        await page.click(SELECTORS.export.link);

        await page.waitForSelector(SELECTORS.export.selectFormatOpen);
        await page.click(SELECTORS.export.selectFormatOpen);
        await page.click(SELECTORS.export.selectFormatCSV);

    }

    async downloadTransactions(page, startMoment, endMoment) {
        this.log(`invoked BNZFlow::downloadTransactions`);

        await this.fillDateField(page, SELECTORS.export.startDateField, startMoment);
        await this.fillDateField(page, SELECTORS.export.endDateField, endMoment);

        return super.downloadCSV(page, SELECTORS.export.exportButton);
    }

    async fillDateField(page, selector, mmmoment) {
        this.log("invoked BNZFlow::fillDateField");

       // BNZ date selectors barf if today is selected, "dates must be in the past"
       const todayMoment = moment();
       if (mmmoment.isSame(todayMoment, 'day')) {
        mmmoment.subtract(1, 'days');
       }

       const date = mmmoment.format(DATE_FORMAT);

       await page.click(selector);
       await page.keyboard.type(date);
       await page.keyboard.press('Tab');

       this.log(`    typed ${date}`);
    }

}

BNZFlow.convertCSV = csvConverter;
BNZFlow.accountName = "BNZ";
module.exports = BNZFlow;
