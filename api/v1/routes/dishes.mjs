import { Router } from "express"
import DishController from "../controllers/DishController.mjs"
import ReviewController from "../controllers/ReviewController.mjs"
import { ensureAuthenticated, isAdmin } from "../../../middlewares/auth.mjs"
import { checkSchema } from "express-validator"
import DishValidator from "../../../validators/DishValidator.mjs"
import upload from "../../../middlewares/multer.mjs"
import ReviewValidator from "../../../validators/ReviewValidator.mjs"

const router = Router()

router.get("/", DishController.getDishesList)

router.get("/:id", DishController.getDishById)

router.get("/:id/reviews", ReviewController.getReviewsByDishId)

router.post(
  "/:id/reviews",
  ensureAuthenticated,
  checkSchema(ReviewValidator.defaultSchema),
  ReviewController.addReview
)

router.post(
  "/",
  isAdmin,
  upload.single("image"),
  checkSchema(DishValidator.defaultSchema),
  DishController.createOrUpdateDish
)

router.put(
  "/:id",
  isAdmin,
  upload.single("image"),
  checkSchema(DishValidator.defaultSchema),
  DishController.createOrUpdateDish
)

router.delete("/:id", isAdmin, DishController.deleteDish)

export default router
