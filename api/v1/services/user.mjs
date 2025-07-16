import GeneralModel from "./general.mjs"
import bcrypt from "bcrypt"
import { default as Location } from "./location.mjs"

class UserModel extends GeneralModel {
  static TABLE = "users"
  async getList(projection = ["id", "username", "avatar_url", "created_at"]) {
    return await super.getList(projection)
  }
  async getById(
    id,
    projection = [
      "id",
      "username",
      "email",
      "phone",
      "avatar_url",
      "points",
      "created_at",
    ]
  ) {
    return await super.getById(id, projection)
  }
  async create(data) {
    try {
      const hash = await bcrypt.hash(data.password, 10)
      delete data.password

      return await super.create({ ...data, password_hash: hash })
    } catch (error) {
      console.log(111)

      throw error
    }
  }
  async updateById(id, data) {
    console.log(data)

    try {
      return await super.updateById(id, data)
    } catch (error) {
      throw error
    }
  }
  async updateCredentials(id, credentials) {
    try {
      const data = {}
      const { email, password } = credentials
      if (email) {
        data.email = email
      }
      if (password) {
        data.password_hash = await bcrypt.hash(password, 10)
      }
      return await super.updateById(id, data)
    } catch (error) {
      throw error
    }
  }
}

export default new UserModel(UserModel.TABLE)
