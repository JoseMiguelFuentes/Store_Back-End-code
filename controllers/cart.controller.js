const { Cart } = require("../models/cart.model")
const { ProductsInCart } = require("../models/productsInCart.model")

const { catchAsync } = require("../util/catchAsyncUtil")
const { appError } = require("../util/appError.util")
const { Product } = require("../models/product.model")
const { protectUsersOrders } = require("../middlewares/auth.middlewares")
const { Order } = require("../models/order.model")

const sendToCart = catchAsync(async (req, res, next) => {
  const {id} = req.cart
  const {product} = req
  const { quantity,productId } = req.body
  if (product === undefined || product === null) {
    const newProduct = await ProductsInCart.create({ cartId:id, productId, quantity })
    return res.status(201).json({
      status: "success",
      data: { product:newProduct },
    })
  }

  if (product.status === 'removed') {
    await product.update({quantity,status:'active'})
    return res.status(201).json({
      status: "success",
      data: { product },
    }) 
  }
  

  
})

const updateCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body
  let { cart } = req

  let product = await ProductsInCart.findOne({where:{productId,cartId:cart.id }})
  if (!product) {
    return next( new appError( `Product not found in the cart`,404))
  }
  if (quantity === 0) {
    await product.update({quantity:0,status:'removed'})
    return res.status(201).json({
      status: "success",
      data: { product },
    })
  }
  await product.update({quantity,status:'active'})

  res.status(201).json({
    status: "success",
    data: { product },
  })
})

const removedProdCart = catchAsync(async (req, res, next) => {
  const {productId} = req.params
  const {cart} = req
  const product = await ProductsInCart.findOne({where:{productId,cartId:cart.id}})
  if (!product) {
    return next( new appError( `Product not found in the cart`,404))
  }
  await product.update({quantity:0,status:'removed'})
  res.status(204).json({ status: "success" })
})

const buyCart = catchAsync(async(req,res,next)=>{
  const {cart} = req
  const {id} = req.sessionUser
  const productsInCart = await ProductsInCart.findAll({where:{cartId:cart.id,status:'active'}})
  let totalPrice = 0
  productsInCart.forEach(async(productInCart)=>{
    let product = await Product.findOne({where:{id:productInCart.productId}})
    totalPrice += product.price * productInCart.quantity
    let newQuantity = product.quantity - productInCart.quantity
    await product.update({quantity:newQuantity})
    await productInCart.update({status:'purchased'})
    console.log(newQuantity)
    
  })
  console.log(totalPrice)
  await cart.update({status:'purchased'})

  await Order.create({userId:id,cartId:cart.id,totalPrice})

  // console.log(productsInCart)
  res.status(200).json({
    status:'success',
    data:{productsInCart,totalPrice}
  })
  
})

module.exports = { sendToCart,updateCart,buyCart,removedProdCart }
