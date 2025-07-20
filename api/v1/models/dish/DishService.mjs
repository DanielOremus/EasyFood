import Dish from "./Dish.mjs"
import CRUDManager from "../CRUDManager.mjs"
import CustomError from "../../../../utils/CustomError.mjs"

class DishService extends CRUDManager {
  async getAll(
    filters = {},
    projection = { exclude: ["restaurantId"] },
    populateParams = null,
    options = {}
  ) {
    return await super.getAll(filters, projection, populateParams, options)
  }
  async getById(
    id,
    projection = { exclude: ["restaurantId"] },
    populateParams = null,
    options = {}
  ) {
    const dish = await super.getById(id, projection, populateParams, options)
    if (!dish) throw new CustomError("Dish not found", 404)
    return dish
  }
}

export default new DishService(Dish)
