import CRUDManager from "../CRUDManager.mjs"
import OrderItem from "./OrderItem.mjs"

class OrderItemService extends CRUDManager {}

export default new OrderItemService(OrderItem)
