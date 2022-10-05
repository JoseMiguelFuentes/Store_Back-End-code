const dotenv = require("dotenv").config()
const { app } = require("./app")
const { initModels } = require("./models/init.models")

const { data } = require("./util/database.util")

const startServer = async () => {
  try {
    await data.authenticate()
    console.log("Base de datos Autenticada.")
    initModels()
    await data.sync()
    console.log("Datos sincronizados")
    const PORT = process.env.PORT || 4080
    app.listen(PORT, () => {
      console.log(`Aplicación lista!, Puerto: ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}
startServer()
