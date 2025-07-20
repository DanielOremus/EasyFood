import LocationService from "../models/location/LocationService.mjs"
import UserService from "../models/user/UserService.mjs"
import { validationResult } from "express-validator"
//TODO: move logic to service
class LocationController {
  static async getUserLocations(req, res) {
    const id = req.params.id
    try {
      const locations = await LocationService.getAllByUserId(id)
      return res.json({ success: true, data: locations })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async addUserLocation(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, msg: errors.array() })

    const { address, lat, lng } = req.body
    const id = req.params.id
    try {
      const location = await LocationService.create({
        user_id: id,
        address,
        lat,
        lng,
      })

      return res.json({
        success: true,
        msg: "Location added",
        data: {
          location_id: location.id,
        },
      })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
}

export default LocationController
