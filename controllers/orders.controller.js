const { Order } = require("../models/order.model");

const { catchAsync } = require("../util/catchAsyncUtil");

const createOrder = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser;
  const { quantity } = req.body;

  const newOrder = await Order.create({
    quantity,
    userId: id,
    totalPrice: meal.price * quantity,
  });
  res.status(201).json({
    status: "success",
    data: { newOrder },
  });
});

const getAllUserOrder = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser;
  const orders = await Order.findAll({
    where: { userId: id },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });

  res.status(200).json({
    status: "success",
    data: { orders },
  });
});

const updateOrder = catchAsync(async (req, res, next) => {
  const { order } = req;
  await order.update({ status: "completed" });
  res.status(200).json({
    status: "success",
    data: { order },
  });
});

const deleteOrder = catchAsync(async (req, res, next) => {
  const { order } = req;
  await order.update({ status: "cancelled" });
  res.status(204).json({
    status: "success",
  });
});

module.exports = { createOrder, getAllUserOrder, updateOrder, deleteOrder };
