import UserService from "../models/user/UserService.mjs"
import JWTHelper from "../../../utils/JWTHelper.mjs"
import { validationResult } from "express-validator"
import { comparePasswords } from "../../../middlewares/password.mjs"
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
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, msg: errors.array() })

    const { username, email, phone, password } = req.body
    try {
      const isAlreadyUsed = await UserService.getOne({ email }, ["id"])
      if (isAlreadyUsed)
        return res
          .status(400)
          .json({ success: false, msg: "This email is already in use" })

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
  static async login(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, msg: errors.array() })

    const { email, password } = req.body
    try {
      const user = await UserService.getOne({ email }, [
        "id",
        "username",
        "email",
        "points",
        "password",
      ])
      if (!user)
        return res
          .status(400)
          .json({ success: false, msg: "Incorrect email or password" })

      const isSame = await comparePasswords(password, user.password)
      if (!isSame)
        return res
          .status(400)
          .json({ success: false, msg: "Incorrect email or password" })

      res.json({
        success: true,
        data: {
          token: JWTHelper.prepareToken({ id: user.id }, req.header),
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            points: user.points,
          },
        },
      })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async updateUserById(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, msg: errors.array() })

    const id = req.user.id
    const { username, phone, avatarUrl } = req.body

    let avatar = avatarUrl
    try {
      if (req.file) {
        avatar = req.file
      }

      const affectedRows = await UserService.update(id, {
        username,
        phone,
        avatar,
      })
      if (!affectedRows)
        return res.status(404).json({ success: false, msg: "User not found" })

      const user = await UserService.getById(id)
      res.json({ success: true, data: user })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
  static async updatePassword(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, msg: errors.array() })

    const id = req.user.id
    const { password, newPassword } = req.body

    try {
      const user = await UserService.getOne({ id }, ["password"])

      if (!user)
        return res.status(404).json({ success: false, msg: "User not found" })

      const isSame = await comparePasswords(password, user.password)
      if (!isSame)
        return res
          .status(400)
          .json({ success: false, msg: "Incorrect password" })

      await UserService.update(id, {
        password: newPassword,
      })

      res.json({ success: true, msg: "Password was changed successfully" })
    } catch (error) {
      res.status(500).json({ success: false, msg: error.message })
    }
  }
}

export default UserController
