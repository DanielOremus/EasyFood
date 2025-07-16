import express from "express"
import { useErrorHandler } from "./middlewares/errorHandler.mjs"
import { initApp } from "./middlewares/appInit.mjs"
import router from "./api/v1/routes/index.mjs"
import connectToDb from "./db/connectToDb.mjs"

const app = express()

connectToDb()

initApp(app)
app.use("/v1", router)
useErrorHandler(app)

export default app
