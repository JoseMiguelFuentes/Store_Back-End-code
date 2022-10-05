const { Order } = require("../models/order.model")

const { catchAsync } = require("../util/catchAsyncUtil")
const { appError } = require("../util/appError.util")

const checkOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const order = await Order.findOne({ where: { id } })
  if (!order) {
    return next(new appError("Order not found", 400))
  }
  if (order.status !== "active") {
    return next(new appError("This order is not active", 403))
  }
  req.order = order
  next()
})

const checkOrderOwner = catchAsync(async (req, res, next) => {
  const orderId = req.order.userId
  const userId = req.sessionUser.id
  if (orderId !== userId) {
    return next(new appError("This order doesn't match the user", 403))
  }
  next()
})

module.exports = { checkOrder, checkOrderOwner }
