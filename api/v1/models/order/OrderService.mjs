import Order from "./Order.mjs"
import CRUDManager from "../CRUDManager.mjs"

class OrderService extends CRUDManager {}

export default new OrderService(Order)
