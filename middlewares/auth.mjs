import UserService from "../api/v1/models/user/UserService.mjs"
import JWTHelper from "../utils/JWTHelper.mjs"

export const ensureAuthenticated = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization
    const token = JWTHelper.parseBearer(bearer, req.header)

    req.user = await UserService.getById(token.id)

    next()
  } catch (error) {
    res.status(401).json({ success: false, msg: "Token is invalid" })
  }
}
