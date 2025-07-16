import User from "./User.mjs"
import CRUDManager from "../CRUDManager.mjs"

class UserService extends CRUDManager {
  async getAll(filters = {}, projection = ["id", "username", "avatar_url"]) {
    return await super.getAll(filters, projection)
  }
  async getById(id, projection = { exclude: ["password", "email"] }) {
    return await super.getById(id, projection)
  }
}

export default new UserService(User)
