const moment = require("moment");
var colors = require('colors');

function prompt(question) {
    return new Promise(resolve => {

        var stdin = process.stdin,
            stdout = process.stdout;

        stdin.resume();
        stdout.write(question.bgGreen.black);

        stdin.once('data', function (data) {
            resolve(data.toString().trim());
        });
    });
}

function wait(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

async function isSelectorVisible(page, selector) {
    return await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        if (!element) return false;
        const style = window.getComputedStyle(element);
        return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }, selector);
}

async function overwriteDateField(page, selector, mmmoment, dateFormat) {
    console.log(`invoked helpers.overwriteDateField`.dim);

    const date = mmmoment.format(dateFormat);

    const elementHandle = await page.$(selector);
    await elementHandle.click();
    await elementHandle.focus();

    // click three times to select all
    await elementHandle.click({ clickCount: 3 });
    await elementHandle.press('Backspace');
    await elementHandle.type(date, 1000);

    console.log(`    typed ${date}`.green);
}

module.exports = { prompt, wait, isSelectorVisible, overwriteDateField };