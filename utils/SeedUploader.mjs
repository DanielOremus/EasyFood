import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import User from "../api/v1/models/user/User.mjs"
import Restaurant from "../api/v1/models/restaurant/Restaurant.mjs"
import Reward from "../api/v1/models/reward/Reward.mjs"
import Dish from "../api/v1/models/dish/Dish.mjs"
import Review from "../api/v1/models/review/Review.mjs"
class SeedUploader {
  static __filename = fileURLToPath(import.meta.url)
  static __dirname = path.dirname(SeedUploader.__filename)
  static getFilePath(fileName) {
    return path.join(SeedUploader.__dirname, `../seed/${fileName}`)
  }

  static async uploadTable(entity, seedName) {
    const filePath = SeedUploader.getFilePath(seedName)
    const data = await fs.readFile(filePath, "utf8")
    const items = JSON.parse(data)
    await entity.bulkCreate(items)
  }
  static async getEntityPromises(entity, seedName) {
    const filePath = SeedUploader.getFilePath(seedName)
    const data = await fs.readFile(filePath, "utf8")
    const items = JSON.parse(data)
    return items.map((item) => entity.create(item))
  }

  static async uploadUsers() {
    const promises = await this.getEntityPromises(User, "users.json")
    await Promise.all[promises]
    // await this.uploadTable(User, "users.json")
    console.log("Users seed was uploaded successfully")
  }
  static async uploadRests() {
    await this.uploadTable(Restaurant, "restaurants.json")
    console.log("Restaurants seed was uploaded successfully")
  }
  static async uploadRewards() {
    await this.uploadTable(Reward, "rewards.json")
    console.log("Rewards seed was uploaded successfully")
  }
  static async uploadDishes() {
    await this.uploadTable(Dish, "dishes.json")
    console.log("Dishes seed was uploaded successfully")
  }
  static async uploadReviews() {
    await this.uploadTable(Review, "reviews.json")
    console.log("Reviews seed was uploaded successfully")
  }

  static async uploadAll() {
    // await Promise.all([
    //   this.uploadUsers(),
    //   this.uploadRests(),
    //   this.uploadRewards(),
    // ])
    // await this.uploadDishes()
    await this.uploadReviews()

    //TODO: fix reviews upload
  }
}

export default SeedUploader
