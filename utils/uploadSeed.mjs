import fs from "fs/promises"
import Location from "../api/v1/models/location/Location.mjs"
import path from "path"
import { fileURLToPath } from "url"
import User from "../api/v1/models/user/User.mjs"

class SeedUploader {
  static __filename = fileURLToPath(import.meta.url)
  static __dirname = path.dirname(SeedUploader.__filename)
  static getFilePath(fileName) {
    return path.join(SeedUploader.__dirname, `../seed/${fileName}`)
  }
  static async getEntityPromises(entityService, seedName) {
    const filePath = SeedUploader.getFilePath(seedName)
    const data = await fs.readFile(filePath, "utf8")
    const items = JSON.parse(data)
    return items.map((item) => entityService.create(item))
  }
  static async uploadAll() {
    const users = await SeedUploader.getEntityPromises(User, "users.json")

    const restaurants = await SeedUploader.getEntityPromises(
      RestaurantService,
      "restaurants.json"
    )

    const dishes = await SeedUploader.getEntityPromises(
      DishService,
      "dishes.json"
    )
    const locations = await SeedUploader.getEntityPromises(
      Location,
      "locations.json"
    )
    await Promise.all([...users, restaurants, dishes, locations])
    console.log("Successfully uploaded all seeds")

    // await SeedUploader.uploadDishes()
  }
}

export default SeedUploader
