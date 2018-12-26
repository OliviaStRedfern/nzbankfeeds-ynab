const sinon = require('sinon')

module.exports = () => {
  return {
    goto: sinon.fake(),
    click: sinon.fake(),
    waitForNavigation: sinon.fake(),
    keyboard: {
      type: sinon.fake()
    }
  }
}
