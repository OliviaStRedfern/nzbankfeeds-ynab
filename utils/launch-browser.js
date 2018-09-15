const puppeteer = require('puppeteer');

async function launchBrowser(slow = 1) {
    console.log(`Launching browser instance`);

    const browser = await puppeteer.launch({
        headless: false,
        slowMo: slow,
    });
    const page = await browser.newPage();
    return page;
}
module.exports = launchBrowser;