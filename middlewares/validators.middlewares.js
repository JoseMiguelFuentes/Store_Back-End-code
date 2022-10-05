const { body, validationResult } = require("express-validator")

const checkValidations = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg)

    const message = errorMessages.join(". ")

    return res.status(400).json({
      status: "error",
      message,
    })
  }
  next()
}

const userValidator = [
  body("username")
    .isString()
    .withMessage("username must be a string")
    .notEmpty()
    .withMessage("username cannot be empty")
    .isLength({ min: 3 })
    .withMessage("username must be at least 3 characters"),
  body("email").isEmail().trim().withMessage("Must provide a valid email"),
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 6, max: 6 })
    .withMessage("Password must be  6 characters"),
  checkValidations,
]
const validateDataProduct = [
  body("title")
    .isString()
    .withMessage("title must be a string")
    .notEmpty()
    .withMessage("title can not be empty")
    .isLength({ min: 5 })
    .withMessage("title must be at least 5 characters"),
  body("price")
    .isNumeric()
    .withMessage("price must be a number")
    .notEmpty()
    .withMessage("price can not be empty"),
  body("description")
    .isString()
    .withMessage("description must be a string")
    .notEmpty()
    .withMessage("description can not be empty")
    .isLength({ min: 10,max:200 })
    .withMessage("description must be at least 10 characters"),
  body("quantity")
    .isNumeric()
    .withMessage("quantity must be a number")
    .notEmpty()
    .withMessage("quantity can not be empty"),
  body("categoryId")
    .isNumeric()
    .withMessage("categoryId must be a number")
    .notEmpty()
    .withMessage("categoryId can not be empty"),
]

module.exports = {
  userValidator,
  validateDataProduct,
}
