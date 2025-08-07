import jwt from "jsonwebtoken"
import config from "../config/default.mjs"

class JWTHelper {
  static accessSecret = config.jwt.access.secret
  static refreshSecret = config.jwt.refresh.secret
  static parseBearer(bearerToken) {
    try {
      let token
      if (bearerToken.startsWith("Bearer ")) token = bearerToken.slice(7)
      const decoded = jwt.verify(token, JWTHelper.accessSecret)
      return decoded
    } catch (error) {
      throw new Error("Token is invalid")
    }
  }

  static prepareAccessToken(data) {
    return jwt.sign(data, JWTHelper.accessSecret, {
      expiresIn: config.jwt.access.expireTime,
    })
  }

  static prepareRefreshToken(data) {
    return jwt.sign(data, JWTHelper.refreshSecret, {
      expiresIn: config.jwt.refresh.expireTime,
    })
  }
}

export default JWTHelper
