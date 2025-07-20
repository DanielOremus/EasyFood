import Dish from "./Dish.mjs"
import CRUDManager from "../CRUDManager.mjs"
import CustomError from "../../../../utils/CustomError.mjs"
import { debugLog } from "../../../../utils/logger.mjs"
import RestaurantService from "../restaurant/RestaurantService.mjs"
class DishService extends CRUDManager {
  async getAll(
    filters = {},
    projection = { exclude: ["restaurantId"] },
    populateParams = null,
    options = {}
  ) {
    try {
      return await super.getAll(filters, projection, populateParams, options)
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
  async getAllByRestId(restId, projection = { exclude: ["restaurantId"] }) {
    try {
      await RestaurantService.getById(restId)
      return await super.getAll({ restaurantId: restId }, projection)
    } catch (error) {
      debugLog(error)
      throw error
    }
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
