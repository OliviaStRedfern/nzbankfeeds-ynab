const { CSV_FOLDER_PATH } = require("../convertCSV/csv-converter");
const fs = require("fs");
const { isCSV } = require("../utils/file-system");
const AbstractFlow = require("./abstract-flow");

class AbstractBankFlow extends AbstractFlow {

    constructor() {
        super();
        this.log("AbstractBankFlow object created");
        this.DATE_FORMAT = "DD/MM/YYYY";

        // Must be overridden
        this.ynabAccount = undefined;
        this.csvConvert = undefined;
        this.SECRETS = undefined;
        this.URL = undefined;
        this.SELECTORS = undefined;
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
