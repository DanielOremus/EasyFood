import UserReward from "../api/v1/models/user_reward/UserReward.mjs"
import RewardService from "../api/v1/models/reward/RewardService.mjs"
import Card from "../api/v1/models/card/Card.mjs"
import UserService from "../api/v1/models/user/UserService.mjs"
import RestaurantService from "../api/v1/models/restaurant/RestaurantService.mjs"
import CustomError from "../utils/CustomError.mjs"
import Dish from "../api/v1/models/dish/Dish.mjs"
import { Op } from "sequelize"
import { debugLog } from "../utils/logger.mjs"

class OrderBusinessValidator {
  static populateTypesFuncs = {
    create: (data) => {
      const populateParams = []
      const { rewardCode, paymentMethod, cardId } = data
      if (rewardCode) {
        populateParams.push({
          model: UserReward,
          include: {
            model: RewardService.model,
            where: { code: rewardCode },
            required: false,
          },
        })
      }
      if (paymentMethod === "card") {
        populateParams.push({
          model: Card,
          where: {
            id: cardId,
          },
          attributes: ["id"],
          required: false,
        })
      }
      return populateParams
    },
  }

  static buildPopulateParams(type, data) {
    let result = []
    if (OrderBusinessValidator.populateTypesFuncs[type])
      result = OrderBusinessValidator.populateTypesFuncs[type](data)
    return result
  }

  static async validateOrderData(orderData, transaction = null) {
    try {
      const userPopulateParams = OrderBusinessValidator.buildPopulateParams(
        "create",
        orderData
      )

      const dishIds = orderData.items.map(({ dishId }) => dishId)

      const [user, restaurant] = await Promise.all([
        UserService.getById(orderData.userId, null, userPopulateParams, {
          transaction,
        }),
        RestaurantService.getById(
          orderData.restaurantId,
          null,
          {
            model: Dish,
            where: { id: { [Op.in]: dishIds } },
            attributes: ["id", "name", "price"],
            required: false,
          },
          {
            transaction,
          }
        ),
      ])

      const existDishes = restaurant.Dishes
      OrderBusinessValidator.validateOrderItems(dishIds, existDishes)
      OrderBusinessValidator.validateSaleData(orderData, user)
      OrderBusinessValidator.validateCard(orderData, user)

      return { existDishes, user }
    } catch (error) {
      debugLog(error)

      throw error
    }
  }
  static validateOrderItems(dishIds, existDishes) {
    const existDishIds = existDishes.map(({ id }) => id)

    const idsSet = new Set(dishIds)
    const existIdsSet = new Set(existDishIds)

    const missingIds = Array.from(idsSet.difference(existIdsSet))

    if (dishIds.length !== existDishIds.length)
      throw new CustomError(
        `Some dishes not found. Missing dishes: ${missingIds.join(", ")}`,
        404
      )

    return true
  }

  static validateSaleData(orderData, user) {
    if (orderData.usePoints && orderData.usePoints > user.points)
      throw new CustomError("Insufficient points", 400)

    if (orderData.rewardCode) {
      const userReward = user.UserReward?.[0]
      const reward = userReward?.Reward
      if (!reward)
        throw new CustomError(
          `User does not own reward with code ${orderData.rewardCode}`,
          400
        )

      const currentDate = Date.now()
      const expireDate = new Date(reward.expireDate)

      if (expireDate < currentDate)
        throw new CustomError("Reward has already expired", 400)

      if (userReward.isClaimed) {
        throw new CustomError("Reward already claimed", 400)
      }
    }

    return true
  }

  static validateCard(orderData, user) {
    const { paymentMethod, cardId } = orderData
    if (paymentMethod === "card") {
      const userCard = user.Cards?.[0]
      if (cardId != userCard?.id) {
        throw new CustomError("User does not own this card", 400)
      }
    }
    return true
  }
}

export default OrderBusinessValidator
