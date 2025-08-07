import RestaurantService from "../services/RestaurantService.mjs"
class RestaurantController {
  static async getRestaurantsList(req, res) {
    try {
      const restaurants = await RestaurantService.getAllWithQuery(req.query)

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
