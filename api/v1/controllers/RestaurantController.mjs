import RestaurantService from "../models/restaurant/RestaurantService.mjs"

class RestaurantController {
  static async getRestaurantsList(req, res) {
    //TODO: add query support
    try {
      const restaurants = await RestaurantService.getAll()
      res.json({ success: true, data: restaurants })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
}

export default RestaurantController
