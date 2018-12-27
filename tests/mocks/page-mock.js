const sinon = require('sinon')

module.exports = () => {
  return {
    goto: sinon.fake.resolves(true),
    click: sinon.fake.resolves(true),
    waitForNavigation: sinon.fake.resolves(true),
    waitForSelector: sinon.fake.resolves(true),
    keyboard: {
      type: sinon.fake.resolves(true)
    }
  }
}
