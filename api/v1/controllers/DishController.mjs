import DishService from "../models/dish/DishService.mjs"

class DishController {
  static async getDishesList(req, res) {
    try {
      const dishes = await DishService.getAll()
      res.json({ success: true, data: dishes })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async getRestaurantDishes(req, res) {
    const { restaurantId } = req.params
    try {
      const dishes = await DishService.getAllByRestId(restaurantId)
      res.json({ success: true, data: dishes })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async getDishById(req, res) {
    const id = req.params.id
    try {
      const dish = await DishService.getById(id)
      res.json({ success: true, data: dish })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
}

export default DishController
