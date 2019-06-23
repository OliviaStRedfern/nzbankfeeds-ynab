require('colors')
class AbstractLogger {
  constructor () {
    this.debugLevel = 2
    // debug level 1 & 2
    this.logColor = 'magenta'
    // debug level 2
    this.infoColor = 'blue'
    this.__filename = __filename
}

  log (message) {
    if (this.debugLevel > 0) this.__print(message, this.logColor)
  }
  info (message) {
    if (this.debugLevel > 1) this.__print(message, this.infoColor)
  }
  __print (message, color) {
    const caller = `<${this.constructor.name}>`
    console.log(`${caller.dim} ${message[color]} ${this.__filename.dim}`)
  }
}
module.exports = AbstractLogger
