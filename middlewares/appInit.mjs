import cookieParser from "cookie-parser"
import logger from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import express from "express"

// get the name of the directory
const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename)
export const initApp = (app) => {
  app.set("views", path.join(__dirname, "../views"))
  app.set("view engine", "ejs")

  app.use(logger("dev"))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, "public")))
}
