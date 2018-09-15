
const moment = require("moment");
const { CSV_FOLDER_PATH } = require("../convertCSV/csv-converter");
const URL = undefined;
const DATE_FORMAT = "DD/MM/YYYY";
const fs = require("fs");
const { isCSV } = require("../utils/file-system");
var colors = require('colors');

const SELECTORS = {
    login: {},
    onlineCode: {},
    accounts: {
        getSelectorForAccount(accountType) {
            return `${accountType}`
        }
    },
    export: {},
    logout: {}
}

class BankFlow {

    constructor() {
        this.log("BankFlow object created");

    }

    log(message) {
        console.log(message.blue);
    }

    async login(page) {
        this.log("invoked BankFlow::login");
    }

    async navigateToExportTransactions(page) {
        this.log("invoked BankFlow::navigateToExportTransactions");
    }

    downloadCSV(page, downloadSelector) {
        this.log(`invoked BankFlow::downloadTransactions`);
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
        this.log("invoked BankFlow::getCSV");

        await this.login(page);
        await this.navigateToExportTransactions(page);
        return this.downloadTransactions(page, startMoment, endMoment);
    }

    async fillDateField(page, selector, mmmoment) {
        this.log("invoked BankFlow::fillDateField");
    }

    async logout(page) {
        this.log("invoked BankFlow::logout");
        this.log("    didn't logout: not implemented");
    }

}

BankFlow.convertCSV = undefined;
BankFlow.accountName = undefined;
module.exports = BankFlow;
