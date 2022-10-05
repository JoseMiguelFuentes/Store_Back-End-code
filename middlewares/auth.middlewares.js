const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

const { User } = require("../models/user.model")

const { catchAsync } = require("../util/catchAsyncUtil")
const { appError } = require("../util/appError.util")

dotenv.config({ path: "./.env" })

const protectSession = catchAsync(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]
  }
  if (!token) {
    return next(new appError("You are not logged", 403))
  }
  const decoded = jwt.verify(token, process.env.JWT_SiGN)
  const user = await User.findOne({
    where: { id: decoded.id, status: "active" },
  })

  if (!user) {
    return next(
      new appError("The owner of the session is no longer active", 403)
    )
  }
  req.sessionUser = user
  next()
})

const protectUsersAccount = catchAsync(async (req, res, next) => {
  const { sessionUser, user } = req
  if (sessionUser.id !== user.id) {
    return next(new appError("You are not the owner of this account.", 403))
  }
  next()
})

const protectPostsOwners = catchAsync(async (req, res, next) => {
  const { sessionUser, post } = req

  if (sessionUser.id !== post.userId) {
    return next(new appError("This post does not belong to you.", 403))
  }
  next()
})

const protectCommentsOwners = catchAsync(async (req, res, next) => {
  const { sessionUser, comment } = req

  if (sessionUser.id !== comment.userId) {
    return next(new appError("This comment does not belong to you.", 403))
  }
  next()
})

const checkUserRole = catchAsync(async (req, res, next) => {
  const { sessionUser } = req
  if (sessionUser.role !== "admin") {
    return next(
      new appError("You do not have the access level for this action.", 403)
    )
  }
  next()
})

const protectUsersOrders = catchAsync(async (req, res, next) => {
  const { order, sessionUser } = req
  if (order.UserId !== sessionUser.id) {
    return next(
      new appError(`The order (${order.id}) does not belong to you.`, 403)
    )
  }
  next()
})

module.exports = {
  protectSession,
  protectUsersAccount,
  checkUserRole,
  protectUsersOrders,
  protectPostsOwners,
}
