import bcrypt from "bcrypt"

export const comparePasswords = async (password, encrypted) => {
  return await bcrypt.compare(password, encrypted)
}
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}
