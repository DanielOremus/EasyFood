import { Router } from "express"
import DishController from "../controllers/DishController.mjs"
import RestaurantController from "../controllers/RestaurantController.mjs"

const router = Router()

router.get("/", RestaurantController.getRestaurantsList)

router.get("/:id", RestaurantController.getRestaurantById)

router.get("/:restaurantId/dishes", DishController.getRestaurantDishes)

export default router
