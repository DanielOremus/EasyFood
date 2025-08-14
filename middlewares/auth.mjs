import UserService from "../api/v1/services/UserService.mjs"
import JWTHelper from "../utils/JWTHelper.mjs"
import { debugLog } from "../utils/logger.mjs"
async function getUserFromBearer(bearer) {
  const token = JWTHelper.parseBearer(bearer)
  return await UserService.getById(token.userId, ["id", "isAdmin"])
}

function getAuthMiddleware(func) {
  return async (req, res, next) => {
    try {
      const user = await getUserFromBearer(req.headers.authorization)
      req.user = user

      if (func && !func(req)) return res.status(403).json({ success: false, msg: "Forbidden" })

      next()
    } catch (error) {
      debugLog(error)
      res.status(401).json({ success: false, msg: error.message })
    }
  }
}

export const requireAuth = getAuthMiddleware()
export const requireAdmin = getAuthMiddleware((req) => req.user?.isAdmin)
export const ownerChecker = (fieldSource, fieldName) =>
  getAuthMiddleware((req) => {
    const userId = req[fieldSource][fieldName]
    return req.user?.id == userId
  })
export const ensureAccOwnerOrAdmin = (fieldSource, fieldName) =>
  getAuthMiddleware((req) => {
    const userId = req[fieldSource][fieldName]
    return req.user?.isAdmin || req.user?.id == userId
  })
