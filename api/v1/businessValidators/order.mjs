import UserReward from "../models/user_reward/UserReward.mjs"
import Card from "../models/card/Card.mjs"
import UserService from "../models/user/UserService.mjs"
import RestaurantService from "../models/restaurant/RestaurantService.mjs"
import CustomError from "../../../utils/CustomError.mjs"
import Dish from "../models/dish/Dish.mjs"
import { Op } from "sequelize"
import { debugLog } from "../../../utils/logger.mjs"
import Reward from "../models/reward/Reward.mjs"
import Side from "../models/side/Side.mjs"
import Category from "../models/category/Category.mjs"
import Subcategory from "../models/subcategory/Subcategory.mjs"

class OrderBusinessValidator {
  static populateTypesFuncs = {
    create: (data) => {
      const populateParams = []
      const { rewardCode, paymentMethod, cardId } = data
      if (rewardCode) {
        populateParams.push({
          model: UserReward,

          include: {
            model: Reward,
            as: "reward",
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

      const dishIds = orderData.items.map((item) => item.dishId)

      const [user, restaurant] = await Promise.all([
        UserService.getById(orderData.userId, null, userPopulateParams, {
          transaction,
        }),
        RestaurantService.getById(
          orderData.restaurantId,
          null,
          {
            model: Dish,
            as: "dishes",
            where: { id: { [Op.in]: dishIds } },
            attributes: ["id", "name", "price"],
            include: [
              {
                model: Side,
              },
              {
                model: Subcategory,
                include: {
                  model: Category,
                },
              },
            ],
            required: false,
          },
          {
            transaction,
          }
        ),
      ])

      const existDishes = restaurant.dishes

      console.log(existDishes)

      OrderBusinessValidator.validateOrderItems(orderData.items, existDishes)
      OrderBusinessValidator.validateSaleData(orderData, user)
      OrderBusinessValidator.validateCard(orderData, user)

      return { existDishes, user }
    } catch (error) {
      debugLog(error)

      throw error
    }
  }
  static validateOrderItems(orderItems, existDishes) {
    const validDishSidesMap = new Map()

    for (const dish of existDishes) {
      const sideSet = new Set()
      if (dish.sides?.length) {
        for (const side of dish.sides) {
          sideSet.add(`${side.id}`)
        }
      }
      validDishSidesMap.set(`${dish.id}`, sideSet)
    }

    for (const { dishId, sides } of orderItems) {
      const stringDishId = `${dishId}`
      if (!validDishSidesMap.has(stringDishId))
        throw new CustomError(`Dish with id '${dishId}' does not exist`, 404)

      const validSides = validDishSidesMap.get(stringDishId)

      for (const sideId of sides ?? []) {
        const stringSideId = `${sideId}`

        if (!validSides.has(stringSideId))
          throw new CustomError(
            `Side with id '${sideId}' is not valid for dish '${dishId}'`,
            409
          )
      }
    }

    return true
  }

  static validateSaleData(orderData, user) {
    //TODO: зробити валідацію щодо змоги застосування кода, тобто визначити чи є страва, до якої можна використати код. Після цього продовжити з створенням замовлення
    if (orderData.usePoints && orderData.usePoints > user.points)
      throw new CustomError("Insufficient points", 400)

    if (orderData.rewardCode) {
      const userReward = user.userRewards[0]
      const reward = userReward?.reward
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
    const { paymentMethod } = orderData
    if (paymentMethod !== "card") return true

    if (user.Cards.length === 0)
      throw new CustomError("User does not own this card", 400)

    return true
  }
}

export default OrderBusinessValidator
