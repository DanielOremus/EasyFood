import Dish from "./Dish.mjs"
import CRUDManager from "../CRUDManager.mjs"

class DishService extends CRUDManager {}

export default new DishService(Dish)
