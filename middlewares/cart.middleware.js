
//Models
const {Cart} = require('../models/cart.model')
const { Product } = require('../models/product.model')
const { ProductsInCart } = require('../models/productsInCart.model')
//Utils
const { appError } = require('../util/appError.util')
const { catchAsync } = require('../util/catchAsyncUtil')


const checkCart = catchAsync(async(req,res,next)=>{
  const { id } = req.sessionUser
  let cart = await Cart.findOne({where:{userId:id,status:'active'}})
  if (!cart) {
    cart = await Cart.create({userId:id})
  }
  req.cart  = cart
  next()
})

const checkProdExistsInCart = catchAsync(async(req,res,next)=>{
  const {id} = req.cart
  const {productId,quantity} = req.body
  const  product  = await ProductsInCart.findOne({where:{cartId:id,productId}})
  
  if (product !== null && product.status === 'active') {
    return next(new appError(`This product  already exists in the cart`,403))
  }
  req.product = product
  next()
})



const checkProductQuantity = catchAsync(async(req,res,next)=>{
  const { productId, quantity } = req.body
  const product = await Product.findOne({where:{id:productId}})
  if (product.quantity < quantity) {
    return next( new appError( `There are only ${product.quantity} units available, you cannot buy more than this`,403))
  }
  next()
})

const protectCartOwner = catchAsync(async(req,res,next)=>{
  const {id} = req.sessionUser
  const cart = await Cart.findOne({where:{userId:id,status:'active'}})
  if (!cart) {
    return next( new appError( `Cart not found`,404))
  } 
  req.cart = cart
  next()
})






module.exports = {checkCart,checkProductQuantity,protectCartOwner,checkProdExistsInCart}