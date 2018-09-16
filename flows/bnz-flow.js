const { prompt, isSelectorVisible } = require('../utils/helpers');
const SECRETS = require('../secrets');
const moment = require("moment");
const csvConvert = require("../convertCSV/bnz2ynab");
const AbstractBankFlow = require("./abstract-bank-flow");
const { ynabAccounts } = require("./ynab-flow")

class BNZFlow extends AbstractBankFlow {

    constructor() {
        super();
        this.log("BNZFlow object created");
        this.ynabAccount = ynabAccounts.BNZ;
        this.csvConvert = csvConvert;
        this.SECRETS = SECRETS.BNZFlow;
        this.URL = "https://secure.bnz.co.nz/auth/personal-login";
        this.HOME = "https://www.bnz.co.nz/client/";
        this.SELECTORS = {
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
    }

    async login(page) {
        this.log("invoked BNZFlow::login");

        super.login(page);

        await prompt('Authorise your login using your device, then press enter');
    }

    async navigateToExportTransactions(page) {
        this.log("invoked BNZFlow::navigateToExportTransactions");

        if (await isSelectorVisible(page, this.SELECTORS.accounts.closePromo)) {
            await page.click(this.SELECTORS.accounts.closePromo);
        }

        await page.waitForSelector(this.SELECTORS.accounts.getSelectorForAccount(this.SELECTORS.accounts.cc));

        await page.click(this.SELECTORS.export.link);

        await page.waitForSelector(this.SELECTORS.export.selectFormatOpen);
        await page.click(this.SELECTORS.export.selectFormatOpen);
        await page.click(this.SELECTORS.export.selectFormatCSV);

    }

    async downloadTransactions(page, startMoment, endMoment) {
        this.log(`invoked BNZFlow::downloadTransactions`);

        await this.fillDateField(page, this.SELECTORS.export.startDateField, startMoment);
        await this.fillDateField(page, this.SELECTORS.export.endDateField, endMoment);

        return super.downloadCSV(page, this.SELECTORS.export.exportButton);
    }

    async fillDateField(page, selector, mmmoment) {
        this.log("invoked BNZFlow::fillDateField");

       // BNZ date selectors barf if today is selected, "dates must be in the past"
       const todayMoment = moment();
       if (mmmoment.isSame(todayMoment, 'day')) {
        mmmoment.subtract(1, 'days');
       }

       const date = mmmoment.format(this.DATE_FORMAT);

       await page.click(selector);
       await page.keyboard.type(date);
       await page.keyboard.press('Tab');

       this.log(`    typed ${date}`);
    }

}

BNZFlow.accountName = "BNZ";
module.exports = BNZFlow;