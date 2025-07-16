import { Router } from "express"
import usersRoutes from "./users.mjs"
import authRoutes from "./auth.mjs"

const router = Router()

router.use("/users", usersRoutes)
router.use("/auth", authRoutes)

export default router
