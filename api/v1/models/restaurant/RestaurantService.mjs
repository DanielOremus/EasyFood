import CustomError from "../../../../utils/CustomError.mjs"
import { debugLog } from "../../../../utils/logger.mjs"
import CRUDManager from "../CRUDManager.mjs"
import Dish from "../dish/Dish.mjs"
import Restaurant from "./Restaurant.mjs"
import SelectionHelper from "../../../../utils/selectionHelpers/SelectionHelper.mjs"

class RestaurantService extends CRUDManager {
  static fieldsConfig = [
    {
      fieldName: "name",
      filterCategory: "search",
    },
  ]
  async getAllWithQuery(reqQuery, projection = null, populateParams = null) {
    try {
      const options = SelectionHelper.applySelection(
        reqQuery,
        RestaurantService.fieldsConfig
      )

      console.log(options)

      const restaurants = await super.getAll(
        null,
        projection,
        populateParams,
        options
      )

      console.log(restaurants)

      return restaurants
    } catch (error) {
      console.log(error)

      console.log("Error while getting list: " + error.message)
      return []
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
