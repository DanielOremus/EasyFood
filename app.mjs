import express from "express"
import { useErrorHandler } from "./middlewares/errorHandler.mjs"
import { initApp } from "./utils/app/init.mjs"
import router from "./api/v1/routes/index.mjs"
import db from "./config/db.mjs"
import SeedUploader from "./utils/seedHelpers/SeedUploader.mjs"
import { initTables, syncTables } from "./utils/seedHelpers/syncTables.mjs"
import { default as createAssociations } from "./api/v1/models/associations/index.mjs"

const app = express()

await db.connect()
createAssociations()
// await syncTables()
// SeedUploader.uploadAll()

initApp(app)
app.use("/api/v1", router)
useErrorHandler(app)

export default app
