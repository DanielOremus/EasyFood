import express from "express"
import { useErrorHandler } from "./middlewares/errorHandler.mjs"
import { initApp } from "./middlewares/appInit.mjs"
import router from "./api/v1/routes/index.mjs"
import db from "./config/db.mjs"
import SeedUploader from "./utils/SeedUploader.mjs"
import { initTables, syncTables } from "./utils/syncTables.mjs"
import { default as createAssociations } from "./api/v1/models/associations.mjs"

const app = express()

await db.connect()
createAssociations()
// await syncTables()
// SeedUploader.uploadAll()

initApp(app)
app.use("/v1", router)
useErrorHandler(app)

export default app
