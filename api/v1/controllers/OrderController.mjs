import OrderService from "../services/OrderService.mjs"
import { validationResult } from "express-validator"
import { formatOrderCreateResponse } from "../../../utils/responseHelper.mjs"

class OrderController {
  static async getOrdersByUserId(req, res) {
    const userId = req.params.userId
    try {
      const orders = await OrderService.getAllByUserId(userId)

      res.json({
        success: true,
        data: orders,
      })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async getOrderById(req, res) {
    const id = req.params.id
    try {
      const order = await OrderService.getById(id)

      res.json({ success: true, data: order })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async createOrder(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, msg: errors.array() })

    const userId = req.user.id

    const {
      restaurantId,
      items,
      deliveryAddress,
      paymentMethod,
      cardId,
      usePoints,
      rewardCode,
    } = req.body

    try {
      const { order, dishBindingObj, rewardApplyMsg } =
        await OrderService.create({
          userId,
          restaurantId,
          items,
          deliveryAddress,
          paymentMethod,
          cardId,
          usePoints,
          rewardCode,
        })

      const resOrder = formatOrderCreateResponse(order, dishBindingObj)

      return res.status(201).json({
        success: true,
        data: resOrder,
        msg: rewardApplyMsg || undefined,
      })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async updateOrderStatus(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, msg: errors.array() })

    const { status } = req.body
    const orderId = req.params.id
    try {
      const { deltaPoints } = await OrderService.updateStatus({
        orderId,
        status,
      })

      res.json({
        success: true,
        msg: "Order status successfully changed",
        data: {
          orderId,
          status,
          pointsEarned: deltaPoints,
        },
      })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async
}

export default OrderController
