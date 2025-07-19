import { Router } from "express"
import DishController from "../controllers/DishController.mjs"

const router = Router()

router.get("/:id", DishController.getDishById)

export default router
