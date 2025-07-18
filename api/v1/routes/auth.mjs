import { Router } from "express"
import UserController from "../controllers/UserController.mjs"
import rateLimiter from "../../../middlewares/rateLimiter.mjs"
import UserValidator from "../../../validators/UserValidator.mjs"
import { checkSchema } from "express-validator"

const router = Router()

router.post(
  "/register",
  rateLimiter,
  checkSchema(UserValidator.registerSchema),
  UserController.register
)

router.post(
  "/login",
  rateLimiter,
  checkSchema(UserValidator.loginSchema),
  UserController.login
)

export default router
