//Models
const { Product } = require("../models/product.model")
const { Category } = require("../models/category.model")
const { ProductImg } = require("../models/productImg.model")
//Utils
const { catchAsync } = require("../util/catchAsyncUtil")
const { appError } = require("../util/appError.util")
const {
  uploadProductImgs,
  getProductsImgsUrl,
  getProductImgsUrl
} = require("../util/firebase.util")

const createProduct = catchAsync(async (req, res, next) => {
  const { title, description, price, categoryId, quantity } = req.body
  const { id } = req.sessionUser

  const newProduct = await Product.create({
    title,
    description,
    price,
    categoryId,
    quantity,
    userId: id,
  })

  await uploadProductImgs(req.files, newProduct.id)

  res.status(201).json({
    status: "success",
    data: { newProduct },
  })
})

const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: { status: "active" },
    attributes: ['id', 'title','description','quantity','price','categoryId','userId','status','createdAt'],
    include: { model: ProductImg,attributes: ['id', 'imgUrl','productId','status']}
  })
  const productsWithImgs = await getProductsImgsUrl(products)

  res.status(200).json({
    status: "success",
    data: { products: productsWithImgs },
  })
})

const getProductById = catchAsync(async (req, res, next) => {
  const { id  } = req.product
  const product = await Product.findByPk(id,
    {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include:[{
        model:ProductImg,
        attributes: { exclude: ["createdAt", "updatedAt"] }
      }]})

  const productWithImgs = await getProductImgsUrl(product)

  res.status(200).json({
    status: "success",
    data: { product:productWithImgs }
  })
})

const updateProduct = catchAsync(async (req, res, next) => {
  const { title, description, price, quantity } = req.body
  const { product } = req
  await product.update({ title, description, price, quantity })

  res.status(200).json({
    status: "success",
    data: { product },
  })
})

const deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req
  await product.update({ status: "deleted" })

  res.status(204).json({
    status: "success"
  })
})

const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll({
    where: { status: "active" },
    attributes: { exclude: ["createdAt", "updatedAt"] }
  })
  console.log('hola')
  res.status(200).json({
    status: "success",
    data: { categories }
  })
})

const addCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body
  const category = await Category.create({ name })
  res.status(201).json({
    status: "success",
    data: { category }
  })
})

const updateCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body
  const { category } = req

  await category.update({ name })
  res.status(200).json({
    status: "success",
    data: { category },
  })
})

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllCategories,
  addCategory,
  updateCategory,
}
