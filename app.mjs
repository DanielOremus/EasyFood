import express from "express"
import { useErrorHandler } from "./middlewares/errorHandler.mjs"
import { initApp } from "./middlewares/appInit.mjs"
import router from "./api/v1/routes/index.mjs"
import db from "./config/db.mjs"
import SeedUploader from "./utils/SeedUploader.mjs"
import UploadsManager from "./utils/UploadsManager.mjs"
import { initTables, syncTables } from "./utils/syncTables.mjs"
const app = express()
UploadsManager.initUploadFolder()

await db.connect()
// await initTables()

// SeedUploader.uploadAll()

initApp(app)
app.use("/v1", router)
useErrorHandler(app)

export default app
