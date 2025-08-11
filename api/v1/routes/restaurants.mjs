import { Router } from "express"
import DishController from "../controllers/DishController.mjs"
import RestaurantController from "../controllers/RestaurantController.mjs"
import { ensureAdmin } from "../../../middlewares/auth.mjs"
import upload from "../../../middlewares/multer.mjs"
import { checkSchema } from "express-validator"
import RestaurantValidator from "../../../validators/RestaurantValidator.mjs"

const router = Router()

router.get("/", RestaurantController.getRestaurantsList)

router.get("/:id", RestaurantController.getRestaurantById)

router.get("/:restaurantId/dishes", DishController.getRestaurantDishes)

router.post(
  "/",
  ensureAdmin,
  upload.single("image"),
  checkSchema(RestaurantValidator.defaultSchema),
  RestaurantController.createOrUpdateRestaurant
)

router.put(
  "/:id",
  ensureAdmin,
  upload.single("image"),
  checkSchema(RestaurantValidator.defaultSchema),
  RestaurantController.createOrUpdateRestaurant
)

router.delete("/:id", ensureAdmin, RestaurantController.deleteRestaurant)

export default router
