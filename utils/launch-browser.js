const puppeteer = require('puppeteer');

async function launchBrowser() {
    console.log(`Launching browser instance`);

    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    return page;
}
module.exports = launchBrowser;