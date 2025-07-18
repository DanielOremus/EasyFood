import User from "./User.mjs"
import CRUDManager from "../CRUDManager.mjs"
import { sequelize } from "../../../../config/db.mjs"
import UploadsManager from "../../../../utils/UploadsManager.mjs"
import { v4 as uuidv4 } from "uuid"

class UserService extends CRUDManager {
  async getAll(filters = {}, projection = ["id", "username", "avatar_url"]) {
    return await super.getAll(filters, projection)
  }
  async getById(id, projection = { exclude: ["password", "email"] }) {
    return await super.getById(id, projection)
  }
  async update(id, data) {
    const t = await sequelize.transaction()
    let currentAvatarUrl
    let fileName
    try {
      //Аватар: файл, або переданий url
      //Якщо переданий аватар в тілі:
      // файл - створюємо файл в потрібній директорії, присвоюємо url в data.avatar_url
      // готовий шлях - присвоюємо в data.avatar_url
      if (data.avatar) {
        if (data.avatar?.buffer) {
          fileName = `avatar_${uuidv4()}.png`
          const relativePath = await UploadsManager.uploadToSubfolder(
            "avatars",
            fileName,
            data.avatar.buffer
          )
          data.avatar_url = relativePath
        } else {
          data.avatar_url = data.avatar
        }
      }

      const user = await this.model.findByPk(id, {
        where: { id },
        attributes: ["avatar_url"],
        transaction: t,
      })

      if (!user) return null

      currentAvatarUrl = user.avatar_url

      //Робимо зміни в бд
      const affected = await this.model.update(data, {
        where: {
          id,
        },
        individualHooks: true,
        transaction: t,
      })

      await t.commit()
      //Якщо шлях до аватару певного рядка не співпадає: спробуємо видалити старий аватар
      if (
        affected &&
        currentAvatarUrl &&
        data.avatar_url &&
        currentAvatarUrl !== data.avatar_url
      ) {
        await UploadsManager.deleteAbsolute(currentAvatarUrl)
      }

      return true
    } catch (error) {
      console.log(error)

      //Якщо щосб пішло не так: спробуємо видалити раніше створений аватар

      await t.rollback()

      if (fileName) {
        await UploadsManager.deleteFromSubfolder("avatars", fileName).catch(
          (e) => {
            console.log("Failed to delete new avatar: " + e.message)
          }
        )
      }

      throw new Error("Error while updating user by id: " + error)
    }
  }
}

export default new UserService(User)
