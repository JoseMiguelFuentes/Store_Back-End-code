const express = require("express");

const {
  createUser,
  updateUser,
  deleteUser,
  login,
  getUserOrders,
  getOrderById,
  getUserProducts,
} = require("../controllers/users.controller");

const { userExists, orderExists } = require("../middlewares/user.middlewares");
const {
  protectSession,
  protectUsersAccount,
  checkUserRole, //pendiente
  protectUsersOrders,
} = require("../middlewares/auth.middlewares");

const { userValidator } = require("../middlewares/validators.middlewares");

const userRouter = express.Router();

userRouter.post("/", userValidator, createUser);

userRouter.post("/login", login);

userRouter.use(protectSession);

userRouter.get("/me", getUserProducts);

userRouter.patch("/:id", userExists, protectUsersAccount, updateUser);

userRouter.delete("/:id", userExists, protectUsersAccount, deleteUser);

userRouter.get("/orders", getUserOrders);

userRouter.get("/orders/:id", orderExists, protectUsersOrders, getOrderById);

module.exports = { userRouter };
