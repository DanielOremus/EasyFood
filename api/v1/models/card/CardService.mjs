import { sequelize } from "../../../../config/db.mjs"
import { debugLog } from "../../../../utils/logger.mjs"
import CRUDManager from "../CRUDManager.mjs"
import UserService from "../user/UserService.mjs"
import Card from "./Card.mjs"

class CardService extends CRUDManager {
  async create(data) {
    //TODO: add exist validation
    try {
      const result = await sequelize.transaction(async (t) => {
        await UserService.getById(data.userId, ["id"], null, {
          transaction: t,
        })

        const last4 = data.cardNumber.slice(-4)

        if (data.isDefault) {
          await super.updateOne(
            { userId: data.userId },
            { isDefault: false },
            {
              transaction: t,
            }
          )
        }

        const card = await super.create(
          {
            ...data,
            last4,
          },
          {
            transaction: t,
          }
        )

        return card
      })
      return result
    } catch (error) {
      debugLog(error)
      throw error
    }
  }
}

export default new CardService(Card)
