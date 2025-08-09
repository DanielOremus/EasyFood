import cron from "node-cron"
import RefreshTokenService from "../api/v1/services/RefreshTokenService.mjs"
import { Op } from "sequelize"
import { debugLog } from "./logger.mjs"

const tokenCleanupTask = cron.createTask("0 0 * * *", async () => {
  try {
    const deletedCount = await RefreshTokenService.deleteMany({
      expiresAt: {
        [Op.lt]: new Date(),
      },
    })
    debugLog(`Deleted ${deletedCount} expired refresh tokens`)
  } catch (error) {
    debugLog("Error during refresh tokens cleanup")
    debugLog(error)
  }
})

export default tokenCleanupTask
