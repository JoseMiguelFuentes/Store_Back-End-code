const { Order } = require("./order.model")
const { User } = require("./user.model")
const { Product } = require("./product.model")
const { Cart } = require("./cart.model")
const { Category } = require("./category.model")
const { ProductImg } = require("./productImg.model")
const { ProductsInCart } = require("./productsInCart.model")

const initModels = () => {
  //*
  User.hasMany(Order, { foreignKey: "userId" })
  Order.belongsTo(User)
  //*
  User.hasOne(Cart, { foreignKey: "userId" })
  Cart.belongsTo(User)
  //*
  User.hasMany(Product, { foreignKey: "userId" })
  Product.belongsTo(User)
  //*
  Order.hasMany(Product, { foreignKey: "userId" })
  Product.belongsTo(Order)
  //*
  Cart.hasOne(Order, { foreignKey: "cartId" })
  Order.belongsTo(Cart)
  //*
  Cart.hasMany(ProductsInCart, { foreignKey: "cartId" })
  ProductsInCart.belongsTo(Cart)
  //*
  Cart.hasMany(Product, { foreignKey: "userId" })
  Product.belongsTo(Cart)
  //*
  Product.hasMany(ProductImg, { foreignKey: "productId" })
  ProductImg.belongsTo(Product)
  //*
  Category.hasOne(Product, { foreignKey: "categoryId" })
  Product.belongsTo(Category)
  //*
  ProductsInCart.hasMany(ProductImg, { foreignKey: "productId" })
  ProductImg.belongsTo(ProductsInCart)
  //pendiente
  Product.hasOne(ProductsInCart, { foreignKey: "productId" })
  ProductsInCart.belongsTo(Product)
}
module.exports = { initModels }
