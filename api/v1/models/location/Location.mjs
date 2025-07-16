import { sequelize } from "../../../../db/connectToDbSeq.mjs"
import { DataTypes } from "sequelize"
import User from "../User/user.mjs"

const Location = sequelize.define(
  "Location",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User must be provided",
        },
      },
    },
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
        isFloat: {
          msg: "lat must be float",
        },
      },
      min: 0.0,
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: {
          msg: "lat must be float",
        },
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

await Location.sync()

export default Location
