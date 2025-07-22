import Order from "./Order.mjs"
import CRUDManager from "../CRUDManager.mjs"
import UserReward from "../user_reward/UserReward.mjs"
import UserService from "../user/UserService.mjs"
import OrderItem from "../order_item/OrderItem.mjs"
import { default as orderConfig } from "../../../../config/order.mjs"
import { sequelize } from "../../../../config/db.mjs"
import User from "../user/User.mjs"
import { default as businessValidator } from "../../businessValidators/order.mjs"
import { debugLog } from "../../../../utils/logger.mjs"
import CustomError from "../../../../utils/CustomError.mjs"
import Reward from "../reward/Reward.mjs"

class OrderService extends CRUDManager {
  static statusActions = {
    [orderConfig.statuses.PENDING]: () => true,
    [orderConfig.statuses.PREPARING]: () => true,
    [orderConfig.statuses.DELIVERED]: async (order, t) => {
      const deltaPoints = order.totalAmount * orderConfig.pointRate
      await User.update(
        {
          points: sequelize.literal(`points + ${deltaPoints}`),
        },
        {
          where: { id: order.userId },
          transaction: t,
        }
      )
      return { deltaPoints }
    },
    [orderConfig.statuses.CANCELLED]: async (order, t) => {},
  }
  async getAllByUserId(id) {
    try {
      await UserService.getById(id)
      //todo: add query support
      return await super.getAll(
        { userId: id },
        { exclude: ["userId"] },
        {
          model: OrderItem,
          as: "items",
        }
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
      model: OrderItem,
      as: "items",
      attributes: {
        exclude: ["orderId"],
      },
    },
    options = {}
  ) {
    try {
      const order = await super.getById(id, projection, populateParams, options)
      if (!order) throw new CustomError("Order not found", 404)

      return order
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
    if (data.usePoints > 0) {
      const maxUsePoints = Math.ceil(
        (totalPrice * orderConfig.maxPointSalePercentage) /
          orderConfig.pointRate
      )
      pointsUsed = Math.min(maxUsePoints, data.usePoints)

      totalPrice -= pointsUsed * orderConfig.pointRate
    }

    return { totalPrice, pointsUsed }
  }
  async create(data) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const { user, existDishes } = await businessValidator.validateOrderData(
          data,
          t
        )

        const reward = user.UserRewards?.[0]?.reward

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
            { points: sequelize.literal(`points-${pointsUsed}`) },
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
              where: {
                userId: user.id,
              },
              include: {
                model: Reward,
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

  async updateStatus(data) {
    const t = await sequelize.transaction()
    try {
      const order = await super.getById(
        data.orderId,
        ["id", "userId", "rewardApplied", "pointsUsed", "totalAmount"],
        null,
        { transaction: t }
      )
      if (!order) throw new CustomError("Order not found", 404)

      if (!OrderService.statusActions[data.status])
        throw new CustomError(`Order status ${data.status} is not supported`)

      const { deltaPoints } = await OrderService.statusActions[data.status](
        order,
        t
      )
      await super.update(order.id, { status: data.status }, { transaction: t })

      await t.commit()

      return { deltaPoints }
    } catch (error) {
      await t.rollback()
      debugLog(error)
      throw error
    }
  }
}

export default new OrderService(Order)
