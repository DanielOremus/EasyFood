import { configDotenv } from "dotenv"
import path from "path"
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
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET,
      expireTime: 7 * 24 * 3600 * 1000, //7d
    },
    access: {
      secret: process.env.JWT_ACCESS_SECRET,
      expireTime: 15 * 60 * 1000, //15 minutes
    },
  },
  docs: {
    outputFile: path.join(import.meta.dirname, "../docs/api_v1_docs.json"),
  },
})
export default config
