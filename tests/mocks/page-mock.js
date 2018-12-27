const sinon = require('sinon')

module.exports = () => {
  return {
    goto: sinon.fake(),
    click: sinon.fake(),
    select: sinon.fake(),
    evaluate: sinon.fake(),
    waitForNavigation: sinon.fake(),
    waitForSelector: sinon.fake(),
    keyboard: {
      type: sinon.fake()
    }
  }
}
