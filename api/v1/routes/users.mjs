import { Router } from "express"
import UserController from "../controllers/UserController.mjs"

const router = Router()

router.get("/", UserController.getUsersList)

router.get("/:id", UserController.getUserById)

router.put("/:id", UserController.updateUserById)

export default router
