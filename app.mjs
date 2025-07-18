import express from "express"
import { useErrorHandler } from "./middlewares/errorHandler.mjs"
import { initApp } from "./middlewares/appInit.mjs"
import router from "./api/v1/routes/index.mjs"
import db from "./config/db.mjs"
import syncTables from "./utils/syncTables.mjs"
import SeedUploader from "./utils/uploadSeed.mjs"
import UploadsManager from "./utils/UploadsManager.mjs"
const app = express()

db.connect()
// syncTables()

// SeedUploader.uploadAll()

initApp(app)
UploadsManager.initUploadFolder()
app.use("/v1", router)
useErrorHandler(app)

export default app
