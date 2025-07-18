import { sequelize } from "../../../../config/db.mjs"
import { DataTypes } from "sequelize"
import User from "../user/User.mjs"

const Location = sequelize.define(
  "Location",
  {
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Address is required",
        },
        len: {
          args: [1, 255],
          msg: "Address must be between 1-255 chars",
        },
      },
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -90,
        max: 90,
      },
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -180,
        max: 180,
      },
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
)

Location.belongsTo(User, {
  foreignKey: {
    allowNull: false,
    name: "user_id",
  },
  onDelete: "CASCADE",
  onUpdate: "RESTRICT",
})

export default Location
