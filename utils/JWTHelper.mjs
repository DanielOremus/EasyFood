import jwt from "jsonwebtoken"
import config from "../config/default.mjs"

class JWTHelper {
  static accessSecret = config.jwt.access.secret
  static refreshSecret = config.jwt.refresh.secret
  static accessExpire = config.jwt.access.expireTime / 1000
  static refreshExpire = config.jwt.refresh.expireTime / 1000
  static parseBearer(bearerToken) {
    try {
      let token
      if (bearerToken.startsWith("Bearer ")) token = bearerToken.slice(7)
      const decoded = JWTHelper.parseAccessToken(token)
      return decoded
    } catch (error) {
      throw new Error("Token is invalid or has expired")
    }
  }

  static parseToken(token, secret) {
    console.log(token)

    return jwt.verify(token, secret)
  }
  static parseAccessToken(token) {
    return JWTHelper.parseToken(token, JWTHelper.accessSecret)
  }
  static parseRefreshToken(token) {
    return JWTHelper.parseToken(token, JWTHelper.refreshSecret)
  }

  static prepareAccessToken(data) {
    return jwt.sign(data, JWTHelper.accessSecret, {
      expiresIn: JWTHelper.accessExpire,
    })
  }

  static prepareRefreshToken(data) {
    return jwt.sign(data, JWTHelper.refreshSecret, {
      expiresIn: JWTHelper.refreshExpire,
    })
  }
}

export default JWTHelper
