const express = require("express");

const {
  createOrder,
  getAllUserOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orders.controller");

const { protectSession } = require("../middlewares/auth.middlewares");
const { checkOrder, checkOrderOwner } = require("../middlewares/orders.middlewares");

const orderRouter = express.Router();

orderRouter.use(protectSession);

orderRouter.post("/", createOrder);

orderRouter.get("/me", getAllUserOrder);

orderRouter.patch("/:id", checkOrder, checkOrderOwner, updateOrder);

orderRouter.delete("/:id", checkOrder, checkOrderOwner, deleteOrder);

orderRouter.get("/orders", getAllUserOrder);

module.exports = { orderRouter };
