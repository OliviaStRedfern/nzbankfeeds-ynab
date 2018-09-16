const LoginFlow = require("./shared-login-flow");
const moment = require("moment");
const { CSV_FOLDER_PATH } = require("../convertCSV/csv-converter");
const fs = require("fs");
const { isCSV } = require("../utils/file-system");
var colors = require('colors');

const SELECTORS = {
    login: {},
    home: "",
    onlineCode: {},
    accounts: {
        getSelectorForAccount(accountType) {
            return `${accountType}`
        }
    },
    export: {},
    logout: {}
}

class AbstractBankFlow {

    constructor() {
        this.log("AbstractBankFlow object created");
        this.DATE_FORMAT = "DD/MM/YYYY";
        this.loginFlow = null;

        // Can be overridden if the URL doesn't redirect to the home page
        this.HOME = null;

        // Must be overridden
        this.ynabAccount = undefined;
        this.csvConvert = undefined;
        this.SECRETS = undefined;
        this.URL = undefined;
        this.SELECTORS = undefined;
    }
    log(message) {
        console.log(message.magenta);
    }

    async login(page) {
        this.log("invoked AbstractBankFlow::login");
        console.log(this.SELECTORS.login.userIDField);
        if (this.loginFlow === null) {
            this.log("    creating LoginFlow object");
            this.loginFlow = new LoginFlow(
                this.URL,
                this.SELECTORS.login.userIDField,
                this.SELECTORS.login.passwordField,
                this.SELECTORS.login.loginButton
            );
            await this.loginFlow.login(page, this.SECRETS.userID, this.SECRETS.password);
        } else {
            this.log("    re-using existing session");
            if (this.HOME === null) {
                await page.goto(this.URL);
            } else {
                await page.goto(this.HOME);
            }
        }
    }

    async navigateToExportTransactions(page) {
        this.log("invoked AbstractBankFlow::navigateToExportTransactions");
    }

    downloadCSV(page, downloadSelector) {
        this.log(`invoked AbstractBankFlow::downloadTransactions`);
        return new Promise(resolve => {
            console.log(`    watching for a new CSV file in ${CSV_FOLDER_PATH}`);
            const watcher = fs.watch(CSV_FOLDER_PATH, {}, (eventType, fileName) => {
                console.log(`        downloading ${fileName}`.italic);
                if (isCSV(fileName)) {
                    console.log(`    finished downloading ${fileName}`.bgCyan.black);
                    watcher.close();
                    resolve(fileName);
                }
            });
            page.click(downloadSelector);
        });
    }

    async getCSV(page, startMoment, endMoment) {
        this.log("invoked AbstractBankFlow::getCSV");

        await this.login(page);
        await this.navigateToExportTransactions(page);
        return this.downloadTransactions(page, startMoment, endMoment);
    }

    async fillDateField(page, selector, mmmoment) {
        this.log("invoked AbstractBankFlow::fillDateField");
    }

    getAccountSelector() {
        this.log("invoked AbstractBankFlow::getAccountSelector");
    }

    async logout(page) {
        this.log("invoked AbstractBankFlow::logout");
        this.log("    didn't logout: not implemented");
    }

}

AbstractBankFlow.convertCSV = undefined;
AbstractBankFlow.accountName = undefined;
module.exports = AbstractBankFlow;
