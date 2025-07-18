import jwt from "jsonwebtoken"
import config from "../config/default.mjs"

class JWTHelper {
  static parseBearer(bearerToken, headers) {
    try {
      let token
      if (bearerToken.startsWith("Bearer ")) token = bearerToken.slice(7)
      const decoded = jwt.verify(token, JWTHelper.prepareSecret(headers))
      return decoded
    } catch (error) {
      throw new Error("Token is invalid")
    }
  }

  static prepareToken(data, headers) {
    return jwt.sign(data, JWTHelper.prepareSecret(headers), {
      expiresIn: config.jwt.expireTime,
    })
  }

  static prepareSecret(headers) {
    return (
      config.jwt.secret + headers["user-agent"] + headers["accept-language"]
    )
  }
}

export default JWTHelper
