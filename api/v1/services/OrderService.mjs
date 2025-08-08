import Order from "../models/Order.mjs"
import CRUDManager from "../models/CRUDManager/index.mjs"
import UserReward from "../models/UserReward.mjs"
import UserService from "./UserService.mjs"
import OrderItem from "../models/OrderItem.mjs"
import { default as orderConfig } from "../../../config/order.mjs"
import { sequelize } from "../../../config/db.mjs"
import { Op } from "sequelize"
import User from "../models/User.mjs"
import { default as businessValidator } from "../businessValidators/order.mjs"
import { debugLog } from "../../../utils/logger.mjs"
import CustomError from "../../../utils/CustomError.mjs"
import Reward from "../models/Reward.mjs"
import { default as rewardConfig } from "../../../config/reward.mjs"
import OrderItemSide from "../models/OrderItemSide.mjs"

//TODO: refactor class
//TODO: add restaurant crud
//TODO: add dish query support (pagination)
//TODO: add auto clear for expired refresh tokens
class OrderService extends CRUDManager {
  static rewardTypeActions = {
    [rewardConfig.types.PERCENTAGE]: ({ applyItemsPrice, discount }) =>
      applyItemsPrice * discount,
    [rewardConfig.types.FIXED]: ({ applyItemsPrice, discount }) =>
      Math.min(discount, applyItemsPrice),
    [rewardConfig.types.FREE_ITEM]: ({ applyItemsPrice }) => applyItemsPrice,
  }
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

      const user = await User.findByPk(order.userId, {
        transaction: t,
        attributes: ["points"],
        include: {
          model: UserReward,
          attributes: ["rewardId"],
        },
      })

      const userRewardsIds = user.userRewards.map(({ rewardId }) => rewardId)

      const availableRewards = await Reward.findAll({
        where: {
          id: {
            [Op.notIn]: userRewardsIds,
          },
          pointsRequired: {
            [Op.lte]: user.points,
          },
        },
        transaction: t,
      })

      if (availableRewards.length) {
        await UserReward.bulkCreate(
          availableRewards.map((reward) => ({
            userId: user.id,
            rewardId: reward.id,
            isClaimed: false,
          })),
          {
            transaction: t,
          }
        )
      }

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
        },
        {
          order: [["createdAt", "DESC"]],
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
  applyReward(reward, dishBindingObj, orderItems, totalPrice) {
    let hasApplied = false
    let rewardApplyMsg = null

    if (!reward) return { hasApplied, newPrice: totalPrice }
    debugLog(dishBindingObj)

    let itemsPrice = 0
    const categoryFieldId = {
      applySubcategoryId: "subcategoryId",
      applyCategoryId: "categoryId",
    }
    let pointer = null
    if (reward.applySubcategoryId) pointer = "applySubcategoryId"
    else if (reward.applyCategoryId) pointer = "applyCategoryId"

    if (
      reward.type === rewardConfig.types.PERCENTAGE ||
      reward.type === rewardConfig.types.FIXED
    ) {
      if (pointer)
        itemsPrice = orderItems.reduce((acc, item) => {
          const id = dishBindingObj[item.dishId][categoryFieldId[pointer]]
          //Ціна без side (reward не дає знижку на side)
          if (reward[pointer] === id) return acc + item.price * item.quantity
          return acc
        }, 0)
      else itemsPrice = totalPrice
    }
    if (reward.type === rewardConfig.types.FREE_ITEM) {
      let item
      if (!pointer) item = orderItems[0] //universal reward
      else
        item = orderItems.find((item) => {
          const id = dishBindingObj[item.dishId][categoryFieldId[pointer]]
          if (reward[pointer] === id) return item
        })
      itemsPrice = item?.price || 0
    }

    debugLog("items price:" + itemsPrice)

    if (itemsPrice > 0) {
      if (OrderService.rewardTypeActions[reward.type]) {
        totalPrice -= OrderService.rewardTypeActions[reward.type]({
          applyItemsPrice: itemsPrice,
          discount: reward.discount,
        })
        hasApplied = true
      } else {
        debugLog("Reward type is not supported")
      }
    } else {
      rewardApplyMsg = "There is no item to apply a reward to."
    }
    return { hasApplied, newPrice: totalPrice, rewardApplyMsg }
  }
  applyPoints(usePoints, totalPrice) {
    let pointsUsed = 0
    if (usePoints > 0) {
      const maxUsePoints = Math.ceil(
        (totalPrice * orderConfig.maxPointSalePercentage) /
          orderConfig.pointRate
      )
      pointsUsed = Math.min(maxUsePoints, usePoints)

      totalPrice -= pointsUsed * orderConfig.pointRate
    }
    return { newPrice: totalPrice, pointsUsed }
  }
  getTotalPrice(orderItems) {
    return orderItems.reduce((acc, { quantity, price, sides }) => {
      const sidesPrice = sides.reduce(
        (accSide, side) => accSide + parseFloat(side.sidePrice),
        0
      )

      return acc + (sidesPrice + parseFloat(price)) * quantity
    }, 0)
  }
  async create(data) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const { user, existDishes } = await businessValidator.validateOrderData(
          data,
          t
        )

        const reward = user.userRewards?.[0]?.reward

        const dishBindingObj = existDishes.reduce(
          (acc, { id, name, price, subcategory, sides }) => {
            acc[id] = {
              name,
              price,
              sidesObj: sides.reduce((acc, side) => {
                acc[side.id] = {
                  name: side.name,
                  price: side.price,
                }
                return acc
              }, {}),
              subcategoryId: subcategory.id,
              categoryId: subcategory.category.id,
            }
            return acc
          },
          {}
        )
        //TODO: optimize maps and reduces
        const orderItems = data.items.map(
          ({ dishId, quantity, notes, sides = [] }) => ({
            dishId,
            quantity,
            price: dishBindingObj[dishId].price,
            sides: sides.map((sideId) => {
              const { name, price } = dishBindingObj[dishId].sidesObj[sideId]
              return {
                sideId,
                sideName: name,
                sidePrice: price,
              }
            }),

            notes,
          })
        )

        const totalPrice = this.getTotalPrice(orderItems)
        debugLog(`Total Price without sale: ${totalPrice}`)

        //Застосування нагороди
        let { hasApplied, newPrice, rewardApplyMsg } = this.applyReward(
          reward,
          dishBindingObj,
          orderItems,
          totalPrice
        )

        let pointsUsed = 0
        //Якщо нагорода не застосована, застосовуємо бали
        if (!hasApplied) {
          const applyPointsData = this.applyPoints(data.usePoints, totalPrice)
          pointsUsed = applyPointsData.pointsUsed
          newPrice = applyPointsData.newPrice
        }
        const order = await super.create(
          {
            userId: user.id,
            restaurantId: data.restaurantId,
            deliveryAddress: data.deliveryAddress,
            paymentMethod: data.paymentMethod,
            pointsUsed,
            rewardApplied: hasApplied ? reward.code : null,
            totalAmount: newPrice,
            status: "pending",
            items: orderItems,
          },
          {
            include: {
              model: OrderItem,
              as: "items",
              include: {
                model: OrderItemSide,
                as: "sides",
              },
            },
            transaction: t,
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

        if (hasApplied) {
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

        return { order, dishBindingObj, rewardApplyMsg }
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
