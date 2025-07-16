import UserService from "../models/user/UserService.mjs"
import JWTHelper from "../../../utils/JWTHelper.mjs"

class UserController {
  static async getUsersList(req, res) {
    try {
      const users = await UserService.getAll()
      res.json({ success: true, data: users })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async getUserById(req, res) {
    const id = req.params.id
    try {
      const user = await UserService.getById(id)
      if (!user) {
        return res.status(404).json({ success: false, msg: "User not found" })
      }
      res.json({ success: true, data: user })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async register(req, res) {
    const { username, email, phone, password } = req.body
    try {
      const user = await UserService.create({
        username,
        email,
        phone,
        password,
      })
      res.status(201).json({
        success: true,
        msg: "User created",
        data: {
          user_id: user.id,
          token: JWTHelper.prepareToken({ id: user.id }, req.headers),
        },
      })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async updateUserById(req, res) {
    const id = req.params.id
    const { username, phone, address } = req.body
    try {
      const affectedRows = await UserService.update(id, {
        username,
        phone,
        address,
      })
      if (affectedRows === 0)
        return res.status(404).json({ success: false, msg: "User not found" })

      const user = await UserService.getById(id, {
        exclude: ["email", "password"],
      })
      res.json({ success: true, data: user })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
}

export default UserController
