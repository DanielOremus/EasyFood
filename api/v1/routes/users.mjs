import { Router } from "express"
import UserController from "../controllers/UserController.mjs"
import { ensureAuthenticated } from "../../../middlewares/auth.mjs"
import { checkSchema } from "express-validator"
import UserValidator from "../../../validators/UserValidator.mjs"
import upload from "../../../middlewares/multer.mjs"

const router = Router()

router.get("/", ensureAuthenticated, UserController.getUsersList)

router.get("/:id", ensureAuthenticated, UserController.getUserById)

router.put(
  "/",
  ensureAuthenticated,
  upload.single("avatar"),
  checkSchema(UserValidator.updateSchema),
  UserController.updateUserById
)

router.put(
  "/password",
  ensureAuthenticated,
  checkSchema(UserValidator.newPasswordSchema),
  UserController.updatePassword
)
export default router
