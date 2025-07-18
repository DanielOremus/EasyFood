import CRUDManager from "../CRUDManager.mjs"
import Restaurant from "./Restaurant.mjs"

class RestaurantService extends CRUDManager {}

export default new RestaurantService(Restaurant)
