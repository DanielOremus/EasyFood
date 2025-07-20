import { DataTypes } from "sequelize"
import { sequelize } from "../../../../config/db.mjs"

const Card = sequelize.define(
  "Card",
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Brand is required",
        },
        len: {
          args: [1, 255],
          msg: "Brand must contain 1-255 chars",
        },
      },
    },
    last4: {
      type: DataTypes.STRING(4),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Last 4 is required",
        },
        len: {
          args: [4, 4],
          msg: "Last 4 must contain exactly 4 digits",
        },
      },
    },
    holderName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Holder name is required",
        },
        len: {
          args: [1, 50],
          msg: "Holder name can contain 1-50 chars",
        },
      },
    },
    expMonth: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
    },
    expYear: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
    underscored: true,
  }
)

export default Card
