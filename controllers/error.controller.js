const { appError } = require("../util/appError.util")

const dotenv = require("dotenv").config()

const sendErrorDev = (error, req, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error,
    stack: error.stack,
  })
}
const sendErrorProd = (error, req, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message || "Something went wrong!",
  })
}

const tokenExpired = () => {
  return new appError("your session has expired", 403)
}
const tokenInvalidSignature = () => {
  return new appError("Invalid session", 403)
}
const dataConstraintError = () => {
  return new appError("Email is already in use", 400)
}
const cartLogError = () => {
  return new appError("Cart not found or don't belong to user", 404)
}

const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500
  error.status = error.status || "fail"
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, req, res)
  } else if (process.env.NODE_ENV === "production") {
    let err = { ...error }
    if (error.name === "TokenExpiredError") err = tokenExpired()
    else if (error.name === "JsonWebTokenError") err = tokenInvalidSignature()
    else if (error.name === "SequelizeUniqueConstraintError")
      err = dataConstraintError()
    else if (error.code === "LIMIT_UNEXPECTED_FILE") err = imgLimitError()
    else if (error.message === "Cart not found") err = cartLogError()
    sendErrorProd(err, req, res)
  }
}
module.exports = { globalErrorHandler }
