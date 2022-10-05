function appError(message, statusCode) {
  Error.call(this, message)
  this.status = statusCode.toString().startsWith("4") ? "error" : "fail"
  this.message = message
  this.statusCode = statusCode

  Error.captureStackTrace(this)
}

module.exports = { appError }
