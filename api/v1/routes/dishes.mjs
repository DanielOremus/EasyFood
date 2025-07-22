import { Router } from "express"
import DishController from "../controllers/DishController.mjs"
import ReviewController from "../controllers/ReviewController.mjs"
import { ensureAuthenticated } from "../../../middlewares/auth.mjs"
import { checkSchema } from "express-validator"
import DishValidator from "../../../validators/DishValidator.mjs"
import upload from "../../../middlewares/multer.mjs"

const router = Router()

router.get("/", DishController.getDishesList)

router.get("/:id", DishController.getDishById)

router.get("/:id/reviews", ReviewController.getReviewsByDishId)

router.post(
  "/",
  ensureAuthenticated,
  upload.single("image"),
  //role validator if need,
  checkSchema(DishValidator.defaultSchema),
  DishController.createOrUpdateDish
)

router.put(
  "/:id",
  ensureAuthenticated,
  upload.single("image"),
  //role validator if need,
  checkSchema(DishValidator.defaultSchema),
  DishController.createOrUpdateDish
)

router.delete(
  "/:id",
  ensureAuthenticated,
  //role validator if need,
  DishController.deleteDish
)

export default router
