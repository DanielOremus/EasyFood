import { validationResult } from "express-validator"
import AuthService from "../services/AuthService.mjs"
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../../../utils/authHelpers.mjs"

class AuthController {
  static async register(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const { username, email, phone, password } = req.body
    try {
      const { user, accessToken, refreshToken } = await AuthService.register(
        {
          username,
          email,
          phone,
          password,
        },
        req.headers
      )

      setRefreshTokenCookie(res, refreshToken)

      res.status(201).json({
        success: true,
        msg: "User created",
        data: {
          accessToken,
          user: {
            id: user.id,
            username: user.username,
            points: user.points,
          },
        },
      })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async login(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ success: false, msg: errors.array() })

    const { email, password } = req.body
    try {
      const { user, accessToken, refreshToken } = await AuthService.login(
        { email, password },
        req.headers
      )

      setRefreshTokenCookie(res, refreshToken)

      res.json({
        success: true,
        data: {
          accessToken,
          user: {
            id: user.id,
            username: user.username,
            points: user.points,
            avatarUrl: user.avatarUrl,
            isAdmin: user.isAdmin,
          },
        },
      })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }

  static async refresh(req, res) {
    const refreshToken = req.cookies.refreshToken

    try {
      const { accessToken, user } = await AuthService.refresh(refreshToken, res)

      res.json({
        success: true,
        data: {
          accessToken,
          user,
        },
      })
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
  static async logout(req, res) {
    const refreshToken = req.cookies.refreshToken
    try {
      await AuthService.logout(refreshToken)
      clearRefreshTokenCookie(res)
      res.sendStatus(204)
    } catch (error) {
      res.status(error.code || 500).json({ success: false, msg: error.message })
    }
  }
}

export default AuthController
