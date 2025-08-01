import { configDotenv } from "dotenv"

configDotenv({ quiet: true })

const config = Object.freeze({
  appEnv: process.env.APP_ENV || "production",
  port: process.env.APP_PORT,
  db: {
    user: process.env.SQL_USER,
    host: process.env.SQL_HOST,
    name: process.env.SQL_DATABASE,
    password: process.env.SQL_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expireTime: "24h",
  },
})
export default config
