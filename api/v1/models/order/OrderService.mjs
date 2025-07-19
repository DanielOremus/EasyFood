import Order from "./Order.mjs"
import CRUDManager from "../CRUDManager.mjs"
import UserReward from "../user_reward/UserReward.mjs"
import RewardService from "../reward/RewardService.mjs"
import UserService from "../user/UserService.mjs"
import OrderItem from "../order_item/OrderItem.mjs"
import { default as orderConfig } from "../../../../config/order.mjs"

import { sequelize } from "../../../../config/db.mjs"
import User from "../user/User.mjs"
import OrderBusinessValidator from "../../../../validators/OrderBusinessValidator.mjs"
import { debugLog } from "../../../../utils/logger.mjs"
class OrderService extends CRUDManager {
  async getAllByUserId(id) {
    try {
      await UserService.getById(id)

      return await super.getAll({ userId: id })
    } catch (error) {
      debugLog(error)
      throw error
    }
  }

  getTotalPrice(data, dishBindingObj, reward) {
    let totalPrice = data.items.reduce(
      (acc, { dishId, quantity }) =>
        acc + quantity * dishBindingObj[dishId].price,
      0
    )

    if (reward) {
      switch (reward.type) {
        case "percentage":
          totalPrice *= 1 - reward.discount
          break
        case "fixed":
          const newPrice = totalPrice - reward.discount
          totalPrice = newPrice < 0 ? 0 : newPrice
          break
        case "free_item":
          break
        default:
          console.log("Reward type is not supported")
          break
      }
    }
    let pointsUsed = 0
    //TODO: add logic for points
    if (data.usePoints > 0) {
      const maxUsePoints = Math.ceil(
        (totalPrice * orderConfig.maxPointSalePercentage) /
          orderConfig.pointRate
      )
      pointsUsed = Math.min(maxUsePoints, data.usePoints)

      totalPrice -= Math.floor(pointsUsed * orderConfig.pointRate)
    }
    console.log(totalPrice)

    return { totalPrice, pointsUsed }
  }
  async create(data) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const { user, existDishes } =
          await OrderBusinessValidator.validateOrderData(data, t)

        const userReward = user.UserReward?.[0]
        const reward = userReward?.Reward

        const dishBindingObj = existDishes.reduce(
          (acc, { id, name, price }) => {
            acc[id] = { name, price }
            return acc
          },
          {}
        )

        const { totalPrice, pointsUsed } = this.getTotalPrice(
          data,
          dishBindingObj,
          reward
        )

        let orderItems = data.items.map(({ dishId, quantity, notes }) => ({
          dishId,
          quantity,
          price: dishBindingObj[dishId].price,
          notes,
        }))

        const order = await super.create(
          {
            userId: user.id,
            restaurantId: data.restaurantId,
            deliveryAddress: data.deliveryAddress,
            paymentMethod: data.paymentMethod,
            pointsUsed,
            rewardApplied: reward?.code,
            totalAmount: totalPrice,
            status: "pending",
            items: orderItems,
          },
          {
            transaction: t,
            include: {
              model: OrderItem,
              as: "items",
            },
          }
        )
        if (pointsUsed > 0) {
          await User.update(
            { points: user.points - pointsUsed },
            {
              where: {
                id: user.id,
              },
              transaction: t,
            }
          )
        }

        if (reward) {
          await UserReward.update(
            { isClaimed: true, claimedDate: new Date() },
            {
              include: {
                model: RewardService.model,
                where: {
                  code: reward.code,
                },
              },
              transaction: t,
            }
          )
        }

        return { order, dishBindingObj }
      })
      return result
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
}

export default new OrderService(Order)
