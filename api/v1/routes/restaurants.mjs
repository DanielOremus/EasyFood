import { Router } from "express"
import DishController from "../controllers/DishController.mjs"

const router = Router()

router.get("/:restaurantId/dishes", DishController.getRestaurantDishes)

export default router
