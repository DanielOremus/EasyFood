import bcrypt from "bcrypt"
import config from "../config/default.mjs"

export const comparePasswords = async (password, encrypted) => {
  return await bcrypt.compare(password, encrypted)
}
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}
export const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.appEnv === "production",
    sameSite: config.appEnv === "production" ? "none" : "strict",
    maxAge: config.jwt.refresh.expireTime,
    path: `/`,
  })
}
export const clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: config.appEnv === "production",
    sameSite: config.appEnv === "production" ? "none" : "strict",
    path: `/`,
  })
}
