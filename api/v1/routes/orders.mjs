import { Router } from "express"
import OrderController from "../controllers/OrderController.mjs"
import { ensureAuthenticated } from "../../../middlewares/auth.mjs"
import { checkSchema } from "express-validator"
import OrderValidator from "../../../validators/OrderValidator.mjs"
const router = Router()

router.post(
  "/",
  ensureAuthenticated,
  checkSchema(OrderValidator.defaultSchema),
  OrderController.createOrder
)

export default router
