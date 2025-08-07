import Review from "./Review.mjs"
import CRUDManager from "../CRUDManager.mjs"
import { debugLog } from "../../../../utils/logger.mjs"
import { sequelize } from "../../../../config/db.mjs"
import DishService from "../dish/DishService.mjs"
import CustomError from "../../../../utils/CustomError.mjs"
import User from "../user/User.mjs"
import Restaurant from "../restaurant/Restaurant.mjs"

class ReviewService extends CRUDManager {
  async getAllByDishId(
    id,
    projection = { exclude: ["id", "userId", "restaurantId", "dishId"] }
  ) {
    try {
      await DishService.getById(id)
      return await super.getAll({ dishId: id }, projection, {
        model: User,
        attributes: ["username", "avatarUrl"],
      })
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
  async create(data) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const dish = await DishService.getById(
          data.dishId,
          ["id"],
          {
            model: Restaurant,
          },
          { transaction: t }
        )

        return await super.create(
          { ...data, restaurantId: dish.restaurant.id },
          { transaction: t }
        )
      })

      return result
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
}

export default new ReviewService(Review)
