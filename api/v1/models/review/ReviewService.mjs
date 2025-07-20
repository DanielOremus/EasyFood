import Review from "./Review.mjs"
import CRUDManager from "../CRUDManager.mjs"
import { debugLog } from "../../../../utils/logger.mjs"
import { sequelize } from "../../../../config/db.mjs"
import RestaurantService from "../restaurant/RestaurantService.mjs"
import DishService from "../dish/DishService.mjs"
import CustomError from "../../../../utils/CustomError.mjs"
import User from "../user/User.mjs"

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
        const [restaurant, dish] = await Promise.all([
          RestaurantService.getById(data.restaurantId, null, null, {
            transaction: t,
          }),
          DishService.getOne(
            { id: data.dishId, restaurantId: data.restaurantId },
            null,
            null,
            { transaction: t }
          ),
        ])

        if (!restaurant) throw new CustomError("Restaurant not found", 404)
        if (!dish) throw new CustomError("Dish not found")

        return await super.create(data, { transaction: t })
      })

      return result
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
}

export default new ReviewService(Review)
