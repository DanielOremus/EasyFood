import RestaurantService from "../models/restaurant/RestaurantService.mjs"
class RestaurantController {
  static async getRestaurantsList(req, res) {
    //TODO: add query support

    try {
      const restaurants = await RestaurantService.getAll()

      res.json({ success: true, data: restaurants })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async getRestaurantById(req, res) {
    const id = req.params.id
    try {
      const restaurant = await RestaurantService.getById(id)

      res.json({
        success: true,
        data: restaurant,
      })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
}

export default RestaurantController
