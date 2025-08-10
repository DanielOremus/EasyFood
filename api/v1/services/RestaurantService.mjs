import CustomError from "../../../utils/CustomError.mjs"
import { debugLog } from "../../../utils/logger.mjs"
import { setValidQueryPagination } from "../../../utils/selectionHelpers/paginationHelpers.mjs"
import CRUDManager from "../models/CRUDManager/index.mjs"
import Dish from "../models/Dish.mjs"
import Restaurant from "../models/Restaurant.mjs"

class RestaurantService extends CRUDManager {
  static fieldsConfig = [
    {
      fieldName: "name",
      filterCategory: "search",
    },
  ]
  static paginationDefaultData = {
    page: 0,
    perPage: 8,
  }
  async getAllWithQuery(reqQuery, projection = null, populateParams = null) {
    try {
      return await super.getAllWithQuery(
        reqQuery,
        RestaurantService.fieldsConfig,
        RestaurantService.paginationDefaultData,
        null,
        projection,
        populateParams,
        options
      )
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
  async getById(
    id,
    projection = null,
    populateParams = {
      model: Dish,
      as: "dishes",
      attributes: {
        exclude: ["restaurantId", "subcategoryId"],
      },
    },
    options = {}
  ) {
    try {
      const restaurant = await super.getById(id, projection, populateParams, options)
      if (!restaurant) throw new CustomError("Restaurant not found", 404)

      return restaurant
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
}

export default new RestaurantService(Restaurant)
