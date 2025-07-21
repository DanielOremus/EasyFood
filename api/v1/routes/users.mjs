import { Router } from "express"
import UserController from "../controllers/UserController.mjs"
import {
  ensureAuthenticated,
  ownerChecker,
} from "../../../middlewares/auth.mjs"
import { checkSchema } from "express-validator"
import UserValidator from "../../../validators/UserValidator.mjs"
import upload from "../../../middlewares/multer.mjs"
import LocationValidator from "../../../validators/LocationValidator.mjs"
import LocationController from "../controllers/LocationController.mjs"
import OrderController from "../controllers/OrderController.mjs"
import CardValidator from "../../../validators/CardValidator.mjs"
import CardController from "../controllers/CardController.mjs"
import RewardController from "../controllers/RewardController.mjs"
import RewardValidator from "../../../validators/RewardValidator.mjs"

const router = Router()

router.get("/", ensureAuthenticated, UserController.getUsersList)

router.get(
  "/:id/locations",
  ownerChecker("params", "id"),
  LocationController.getUserLocations
)

router.get(
  "/:userId/orders",
  ownerChecker("params", "userId"),
  OrderController.getUserOrders
)

router.get("/:id", ownerChecker("params", "id"), UserController.getUserById)

router.get(
  "/:id/rewards",
  ownerChecker("params", "id"),
  RewardController.getRewardsByUserId
)

router.post(
  "/:id/locations",
  ownerChecker("params", "id"),
  checkSchema(LocationValidator.defaultSchema),
  LocationController.addUserLocation
)

router.post(
  "/:id/cards",
  ownerChecker("params", "id"),
  checkSchema(CardValidator.defaultSchema),
  CardController.createCard
)

router.post(
  "/:id/rewards",
  ensureAuthenticated,
  checkSchema(RewardValidator.addForUserSchema),
  RewardController.addRewardForUser
)

router.put(
  "/:id",
  ownerChecker("params", "id"),
  upload.single("avatar"),
  checkSchema(UserValidator.updateSchema),
  UserController.updateUserById
)

router.put(
  "/:id/password",
  ownerChecker("params", "id"),
  checkSchema(UserValidator.newPasswordSchema),
  UserController.updatePassword
)
export default router
