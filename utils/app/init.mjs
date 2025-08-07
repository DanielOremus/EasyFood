import cookieParser from "cookie-parser"
import logger from "morgan"
import path from "path"
import express from "express"
import UploadsManager from "../UploadsManager.mjs"

const __dirname = import.meta.dirname

export const initApp = (app) => {
  app.set("views", path.join(__dirname, "../../views"))
  app.set("view engine", "ejs")

  app.use(logger("dev"))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, "../../public")))
  app.use("/uploads", express.static(path.join(__dirname, "../../uploads")))

  UploadsManager.initUploadFolder()
}
