const { Order } = require("../models/order.model")
const { User } = require("../models/user.model")
const { appError } = require("../util/appError.util")
const { catchAsync } = require("../util/catchAsyncUtil")

const userExists = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const user = await User.findOne({ where: { id } })
  if (!user) {
    return next(new appError("User not found", 404))
  }
  req.user = user
  next()
})

const orderExists = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const order = await Order.findByPk(id)
  if (!order) {
    return next(
      new appError(`Order with id (${id}) doesn't exist in our server.`, 404)
    )
  }
  req.order = order
  next()
})

module.exports = {
  userExists,
  orderExists,
}
