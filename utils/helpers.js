require('colors')
const readlineSync = require('readline-sync')

function prompt (text) {
  return readlineSync.question(text)
}

function secretPrompt (text) {
  return readlineSync.question(text, {
    hideEchoBack: true,
  })
}

function wait (time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}

async function isSelectorVisible (page, selector) {
  return page.evaluate((selector) => {
    const element = document.querySelector(selector)
    if (!element) return false
    const style = window.getComputedStyle(element)
    return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
  }, selector)
}

async function overwriteDateField (page, selector, mmmoment, dateFormat) {
  console.log(`invoked helpers.overwriteDateField`.dim)

  const date = mmmoment.format(dateFormat)

  const elementHandle = await page.$(selector)
  await elementHandle.click()
  await elementHandle.focus()

  // click three times to select all
  await elementHandle.click({ clickCount: 3 })
  await elementHandle.press('Backspace')
  await elementHandle.type(date, 1000)
  await elementHandle.press('Escape')

  console.log(`    typed ${date}`.green)
}

module.exports = { prompt, secretPrompt, wait, isSelectorVisible, overwriteDateField }
