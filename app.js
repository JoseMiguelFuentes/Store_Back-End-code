const express = require("express")
const dotenv = require('dotenv').config()
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
//Routes
const { orderRouter } = require("./routes/order.routes")
const { userRouter } = require("./routes/user.routes")
const { productRouter } = require("./routes/product.routes")
const { cartRouter } = require("./routes/cart.routes")

const { globalErrorHandler } = require("./controllers/error.controller.js")


const app = express()

app.use(express.json())
//*Security headers
app.use(helmet())
//*To compress the size request
app.use(compression())
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
else app.use(morgan('combined'))


app.use("/api/v1/users", userRouter)
app.use("/api/v1/orders", orderRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/cart", cartRouter)

app.use(globalErrorHandler)

app.all("*", (req, res) => {
  const { method, url } = req

  res.status(404).json({
    status: "error",
    message: `${method} ${url} doesn't exist in our server`,
  })
})

module.exports = { app }
