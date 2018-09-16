const BankFlow = require("./kiwibank-flow");


class KiwibankCCFlow extends KiwibankFlow {

    constructor() {
        super();
        this.log("KiwibankCCFlow object created");

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

        await overwriteDateField(page, selector, mmmoment, this.DATE_FORMAT);
    }

}

KiwibankFlow.convertCSV = csvConverter;
KiwibankFlow.accountName = "Kiwibank";
module.exports = KiwibankFlow;
