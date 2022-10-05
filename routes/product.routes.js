const express = require("express")
//Middleware
const { protectSession } = require("../middlewares/auth.middlewares")
const { validateDataProduct } = require("../middlewares/validators.middlewares")
const {
  checkProductExists,
  checkProductOwner,
  checkCategoryExists,
} = require("../middlewares/product.middleware")
//Controllers
const {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  getAllCategories,
  addCategory,
  updateCategory,
} = require("../controllers/products.controller")

//Utils
const { upload } = require("../util/multer.util")
//Routes
const productRouter = express.Router()

productRouter.get("/", getAllProducts)

productRouter.get("/categories", getAllCategories)

productRouter.get("/:id", checkProductExists, getProductById)



productRouter.use(protectSession)

productRouter.post("/",validateDataProduct,upload.array("productImg", 5),createProduct)

productRouter.post("/categories", addCategory)

productRouter.patch("/:id",checkProductExists,checkProductOwner,updateProduct)

productRouter.patch("/categories/:id",checkCategoryExists,updateCategory)

productRouter.delete("/:id",checkProductExists,checkProductOwner,deleteProduct
)

module.exports = { productRouter }
