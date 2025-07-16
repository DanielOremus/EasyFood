import { Sequelize } from "sequelize"
import config from "../config/default.mjs"

const sequelize = new Sequelize({
  host: config.db.host,
  dialect: "mysql",
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
})

export { sequelize }

export default async function connectToDb() {
  try {
    await sequelize.authenticate()
    console.log("Successfully connected to DB")
  } catch (error) {
    console.log("Failed to connect to DB")
    console.log(error)
    process.exit(1)
  }
}
