const express = require("express")
//Middlewares
const { protectSession } = require("../middlewares/auth.middlewares")
const { checkCart, checkProductQuantity, protectCartOwner, checkProdExistsInCart } = require("../middlewares/cart.middleware")

const { sendToCart, updateCart, removedProdCart,buyCart } = require("../controllers/cart.controller")


const cartRouter = express.Router()

cartRouter.use(protectSession)

cartRouter.post("/add-product",checkProductQuantity,checkCart,checkProdExistsInCart,sendToCart)
cartRouter.patch("/update-cart",protectCartOwner,checkProductQuantity, updateCart)
cartRouter.delete("/:productId",protectCartOwner,removedProdCart)
cartRouter.post("/purchase",protectCartOwner,buyCart)

module.exports = { cartRouter }
