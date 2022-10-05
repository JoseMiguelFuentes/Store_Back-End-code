const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

const { User } = require("../models/user.model")
const { Order } = require("../models/order.model")
const { Product } = require("../models/product.model")
const { Cart } = require("../models/cart.model")

const { catchAsync } = require("../util/catchAsyncUtil")
const { appError } = require("../util/appError.util")
const { ProductsInCart } = require("../models/productsInCart.model")
const { ProductImg } = require("../models/productImg.model")
const { getProductsImgsUrl } = require("../util/firebase.util")

dotenv.config({ path: "./.env" })

const createUser = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body
  const salt = await bcrypt.genSalt(12)
  const hashedPassword = await bcrypt.hash(password, salt)

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  })
  newUser.password = undefined
  res.status(201).json({
    status: "success",
    data: { newUser },
  })
})

const updateUser = catchAsync(async (req, res, next) => {
  const { username, email } = req.body
  const { user } = req
  await user.update({ username, email })
  user.password = undefined
  res.status(200).json({
    status: "success",
    data: { user },
  })
})

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req
  await user.update({ status: "deleted" })
  res.status(204).json({ status: "success" })
})

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({
    where: { email },
    status: "active",
  })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new appError("Wrong credentials", 400))
  }
  
  const token = jwt.sign({ id: user.id }, process.env.JWT_SIGN, {
    expiresIn: "3h",
  })
  user.password = undefined
  res.status(200).json({
    status: "success",
    data: { user, token },
  })
})
const getUserOrders = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser
  const orders = await Order.findAll({
    where: { userId: id },
    attributes:{exclude:['updatedAt']},
    include: [
      {
        model:Cart,attributes:{exclude:['updatedAt','createdAt']},include:{model:ProductsInCart,
          attributes:{exclude:['updatedAt','createdAt']},
          where: { status: "purchased"},
          include:{model:Product,
            attributes:{exclude:['updatedAt','createdAt']}
          }
        }
      }
    ]
  })

  res.status(200).json({
    status: "success",
    data: { orders },
  })
})
const getOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.order
  const order = await Order.findByPk(id)
  res.status(200).json({
    status: "success",
    data: { order },
  })
})

const getUserProducts = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser
  const products = await Product.findAll({ where: { userId: id },
    attributes: ['id', 'title','description','quantity','price','categoryId','userId','status','createdAt'],
    include: { model: ProductImg,attributes: ['id', 'imgUrl','productId','status']  }
  })
  const productsWithImgs = await getProductsImgsUrl(products)
  res.status(200).json({
    status: "success",
    data: { products:productsWithImgs},
  })
})

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  login,
  getUserOrders,
  getOrderById,
  getUserProducts,
}
