import UserService from "../api/v1/models/user/UserService.mjs"
import JWTHelper from "../utils/JWTHelper.mjs"

export const ensureAuthenticated = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization
    const token = JWTHelper.parseBearer(bearer, req.headers)

    req.user = await UserService.getById(token.id)

    next()
  } catch (error) {
    res.status(401).json({ success: false, msg: "Token is invalid" })
  }
}

export const ownerChecker = (fieldSource, userIdFieldName) => {
  return async (req, res, next) => {
    try {
      const bearer = req.headers.authorization
      const token = JWTHelper.parseBearer(bearer, req.headers)

      req.user = await UserService.getById(token.id)
      const userId = req[fieldSource][userIdFieldName]

      if (req.user.id != userId)
        return res.status(403).json({ success: false, msg: "Forbidden" })

      next()
    } catch (error) {
      res.status(401).json({ success: false, msg: "Token is invalid" })
    }
  }
}
