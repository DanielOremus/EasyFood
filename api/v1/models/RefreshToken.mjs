import { DataTypes } from "sequelize"
import { sequelize } from "../../../config/db.mjs"

const RefreshToken = sequelize.define(
  "refreshToken",
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    underscored: true,
    updatedAt: false,
  }
)

export default RefreshToken
