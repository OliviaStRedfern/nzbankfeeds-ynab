class AbstractMethodInvocationError extends Error {
  constructor () {
    super('AbstractMethodInvocationError')
    // properly capture stack trace in Node.js
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
  }
}

class ClassInitializationError extends Error {
  constructor () {
    super('ClassInitializationError')
    // properly capture stack trace in Node.js
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
  }
}
module.exports = { AbstractMethodInvocationError, ClassInitializationError }
