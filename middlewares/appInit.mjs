import cookieParser from "cookie-parser"
import logger from "morgan"
import path from "path"
import { __dirname } from "../utils/path.mjs"
import express from "express"

// get the name of the directory

export const initApp = (app) => {
  app.set("views", path.join(__dirname, "../views"))
  app.set("view engine", "ejs")

  app.use(logger("dev"))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, "../public")))
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")))
}
