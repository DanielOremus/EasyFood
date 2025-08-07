import User from "./User.mjs"
import CRUDManager from "../CRUDManager.mjs"
import { sequelize } from "../../../../config/db.mjs"
import UploadsManager from "../../../../utils/UploadsManager.mjs"
import { v4 as uuidv4 } from "uuid"
import CustomError from "../../../../utils/CustomError.mjs"
import { comparePasswords } from "../../../../middlewares/password.mjs"
import JWTHelper from "../../../../utils/JWTHelper.mjs"
import { debugLog } from "../../../../utils/logger.mjs"
import RewardService from "../reward/RewardService.mjs"
import UserReward from "../user_reward/UserReward.mjs"

class UserService extends CRUDManager {
  async register(data, headers) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const [user, created] = await this.model.findOrCreate({
          where: { email: data.email },
          defaults: data,
          transaction: t,
        })
        if (!created) throw new CustomError("This email is already in use", 400)

        const availableRewards = await RewardService.getAll(
          {
            pointsRequired: 0,
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

        const token = JWTHelper.prepareToken({ id: user.id }, headers)

        return { user, token }
      })
      return result
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
  async login(data, headers) {
    try {
      const user = await super.getOne(
        { email: data.email },
        ["id", "username", "email", "points", "password"],
        null
      )
      if (!user) throw new CustomError("Invalid email or password", 401)

      const isSame = await comparePasswords(data.password, user.password)
      if (!isSame) throw new CustomError("Invalid email or password", 401)

      const token = JWTHelper.prepareToken({ id: user.id }, headers)

      return { user, token }
    } catch (error) {
      debugLog(error)

      throw error
    }
  }
  async getAll(
    filters = {},
    projection = ["id", "username", "avatarUrl"],
    populateParams = null
  ) {
    return await super.getAll(filters, projection, populateParams)
  }
  async getById(
    id,
    projection = { exclude: ["password", "email"] },
    populateParams = null,
    options = {}
  ) {
    try {
      const user = await super.getById(id, projection, populateParams, options)
      if (!user) throw new CustomError("User not found", 404)
      return user
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
  async update(id, data) {
    let fileName
    try {
      const result = await sequelize.transaction(async (t) => {
        const exists = await this.getById(id, ["avatarUrl"], null, {
          transaction: t,
        })

        const currentAvatarUrl = exists.avatarUrl
        if (data.avatar) {
          if (data.avatar?.buffer) {
            fileName = `avatar_${uuidv4()}.png`
            const relativePath = await UploadsManager.uploadToSubfolder(
              "avatars",
              fileName,
              data.avatar.buffer
            )
            data.avatarUrl = relativePath
          } else {
            data.avatarUrl = data.avatar
          }
        }

        //Робимо зміни в бд
        const affected = await super.update(id, data, {
          individualHooks: true,
          transaction: t,
        })

        //Якщо шлях до аватару певного рядка не співпадає: спробуємо видалити старий аватар
        if (
          affected &&
          currentAvatarUrl &&
          data.avatarUrl &&
          currentAvatarUrl !== data.avatarUrl
        )
          await UploadsManager.deleteAbsolute(currentAvatarUrl)

        const user = await super.getById(
          id,
          { exclude: ["email", "password"] },
          null,
          { transaction: t }
        )

        return user
      })

      return result
    } catch (error) {
      //Якщо щось пішло не так: видаляємо раніше створений аватар
      if (fileName) {
        await UploadsManager.deleteFromSubfolder("avatars", fileName).catch(
          (e) => {
            console.log("Failed to delete uploaded avatar: " + e.message)
          }
        )
      }

      debugLog(error)

      throw error
    }
  }
  async updatePassword(id, data) {
    try {
      const result = await sequelize.transaction(async (t) => {
        const user = await super.getById(id, ["password"], null, {
          transaction: t,
        })
        if (!user) throw new CustomError("User not found", 404)
        const isValid = await comparePasswords(data.password, user.password)
        if (!isValid) throw new CustomError("Incorrect password", 400)
        const isSame = await comparePasswords(data.newPassword, user.password)
        if (isSame)
          throw new CustomError(
            "Current password is the same as the new one",
            400
          )
        await super.update(
          id,
          { password: data.newPassword },
          {
            individualHooks: true,
            transaction: t,
          }
        )

        return true
      })
      return result
    } catch (error) {
      debugLog(error)

      throw error
    }
  }
}

// {
//    "restaurantId": 1,
//    "items": [
//     {
//         "dishId": 1,
//         "quantity": 2
//     },
//     {
//         "dishId": 2,
//         "quantity": 2
//     }
//    ],
//    "deliveryAddress": "Оноківська",
//    "paymentMethod": "card",
//    "usePoints": "10",
//    "rewardCode": "SUSHI30",
//    "cardId": "111"

// }

export default new UserService(User)
