const { Category } = require("../models/category.model")
const { Product } = require("../models/product.model")
const { appError } = require("../util/appError.util")
const { catchAsync } = require("../util/catchAsyncUtil")

const checkProductExists = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const product = await Product.findOne({ where: { id } })

  if (!product) {
    return next(new appError("product not found", 404))
  }
  req.product = product
  next()
})

const checkProductOwner = catchAsync(async (req, res, next) => {
  const { userId } = req.product
  const { id } = req.sessionUser

  if (userId !== id) {
    return next(new appError("You're not creator of this product", 403))
  }
  next()
})

const checkCategoryExists = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const category = await Category.findOne({ where: { id } })

  if (!category) {
    return next(new appError("category not found", 404))
  }
  req.category = category
  next()
})





module.exports = { checkProductExists, checkProductOwner, checkCategoryExists }
