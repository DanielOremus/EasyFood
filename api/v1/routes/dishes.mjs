import { Router } from "express"
import DishController from "../controllers/DishController.mjs"
import ReviewController from "../controllers/ReviewController.mjs"

const router = Router()

router.get("/", DishController.getDishesList)

router.get("/:id", DishController.getDishById)

router.get("/:id/reviews", ReviewController.getReviewsByDishId)

export default router
