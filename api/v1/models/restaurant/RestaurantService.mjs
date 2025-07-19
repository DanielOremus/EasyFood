import CustomError from "../../../../utils/CustomError.mjs"
import { debugLog } from "../../../../utils/logger.mjs"
import CRUDManager from "../CRUDManager.mjs"
import Restaurant from "./Restaurant.mjs"

class RestaurantService extends CRUDManager {
  async getById(id, projection = null, populateParams = null, options = {}) {
    try {
      const restaurant = await super.getById(
        id,
        projection,
        populateParams,
        options
      )
      if (!restaurant) throw new CustomError("Restaurant not found", 404)

      return restaurant
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
}

export default new RestaurantService(Restaurant)
