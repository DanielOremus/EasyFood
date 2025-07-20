import RestaurantService from "../models/restaurant/RestaurantService.mjs"
import DishService from "../models/dish/DishService.mjs"

class DishController {
  static async getRestaurantDishes(req, res) {
    //TODO: move logic to service
    const { restaurantId } = req.params
    try {
      await RestaurantService.getById(restaurantId)
      const dishes = await DishService.getAll({ restaurant_id: restaurantId })
      res.json({ success: true, data: { dishes } })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async getDishById(req, res) {
    const id = req.params.id
    try {
      const dish = await DishService.getById(id)
      res.json({ success: true, data: { dish } })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
}

export default DishController
