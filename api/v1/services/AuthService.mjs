import { sequelize } from "../../../config/db.mjs"
import CustomError from "../../../utils/CustomError.mjs"
import { debugLog } from "../../../utils/logger.mjs"
import JWTHelper from "../../../utils/JWTHelper.mjs"
import { v4 as uuidv4 } from "uuid"
import RefreshTokenService from "./RefreshTokenService.mjs"
import config from "../../../config/default.mjs"
import RewardService from "./RewardService.mjs"
import UserReward from "../models/UserReward.mjs"
import UserService from "./UserService.mjs"
import {
  clearRefreshTokenCookie,
  comparePasswords,
} from "../../../utils/authHelpers.mjs"

class AuthService {
  async register(data, headers) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const [user, created] = await UserService.model.findOrCreate({
          where: { email: data.email },
          defaults: data,
          transaction: t,
        })
        if (!created) throw new CustomError("This email is already in use", 400)

        const refreshToken = JWTHelper.prepareRefreshToken({
          userId: user.id,
          jti: uuidv4(),
        })
        const accessToken = JWTHelper.prepareAccessToken({ userId: user.id })

        await RefreshTokenService.create(
          {
            userId: user.id,
            token: refreshToken,
            expiresAt: Date.now() + config.jwt.refresh.expireTime,
            deviceId: headers["user-agent"] || null,
          },
          {
            transaction: t,
          }
        )

        const availableRewards = await RewardService.getAll(
          {
            pointsRequired: user.points,
          },
          null,
          null,
          {
            transaction: t,
          }
        )

        if (availableRewards.length) {
          await UserReward.bulkCreate(
            availableRewards.map((reward) => ({
              userId: user.id,
              rewardId: reward.id,
              isClaimed: false,
            })),
            {
              transaction: t,
            }
          )
        }

        return { user, accessToken, refreshToken }
      })
      return result
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
  async login(data, headers) {
    try {
      const user = await UserService.getOne(
        { email: data.email },
        ["id", "username", "email", "points", "password"],
        null
      )
      if (!user) throw new CustomError("Invalid email or password", 401)

      const isSame = await comparePasswords(data.password, user.password)
      if (!isSame) throw new CustomError("Invalid email or password", 401)

      const refreshToken = JWTHelper.prepareRefreshToken({
        userId: user.id,
        jti: uuidv4(),
      })
      const accessToken = JWTHelper.prepareAccessToken({ userId: user.id })

      await RefreshTokenService.create({
        userId: user.id,
        token: refreshToken,
        expiresAt: Date.now() + config.jwt.refresh.expireTime,
        deviceId: headers["user-agent"] || null,
      })

      return { user, accessToken, refreshToken }
    } catch (error) {
      debugLog(error)

      throw error
    }
  }
  async refresh(refreshToken, res) {
    if (!refreshToken) throw new CustomError("No refresh token provided", 401)
    try {
      const storedToken = await RefreshTokenService.getOne({
        token: refreshToken,
      })
      if (!storedToken) throw new CustomError("Invalid refresh token", 401)

      if (new Date(storedToken.expiresAt) < Date.now()) {
        await storedToken.destroy()
        clearRefreshTokenCookie(res)
        throw new CustomError("Refresh token is expired", 401)
      }

      const decoded = JWTHelper.parseRefreshToken(storedToken.token)

      if (decoded.userId !== storedToken.userId)
        throw new CustomError("Invalid refresh token", 401)

      const user = await UserService.getById(storedToken.userId, [
        "id",
        "username",
        "points",
      ]).catch((error) => {
        if (error instanceof CustomError)
          throw new CustomError("User not found", 401)
        throw error
      })

      const accessToken = JWTHelper.prepareAccessToken({ userId: user.id })

      return { user, accessToken }
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
  async logout(refreshToken) {
    try {
      if (!refreshToken) throw new CustomError("No refresh token provided", 401)
      return await RefreshTokenService.deleteOne({ token: refreshToken })
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
}

export default new AuthService()
