import UserService from "../api/v1/services/UserService.mjs"
import JWTHelper from "../utils/JWTHelper.mjs"
async function setUserFromToken(req) {
  const bearer = req.headers.authorization
  const token = JWTHelper.parseBearer(bearer, req.headers)

  req.user = await UserService.getById(token.userId)
}

function getAuthMiddleware(func) {
  return async (req, res, next) => {
    try {
      await setUserFromToken(req)

      if (func && !func(req)) return res.status(403).json({ success: false, msg: "Forbidden" })

      next()
    } catch (error) {
      res.status(401).json({ success: false, msg: error.message })
    }
  }
}

export const ensureAuthenticated = getAuthMiddleware()
export const ensureAdmin = getAuthMiddleware((req) => req.user?.isAdmin)
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
