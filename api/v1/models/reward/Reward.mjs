import { sequelize } from "../../../../config/db.mjs"
import { DataTypes } from "sequelize"

const Reward = sequelize.define(
  "Reward",
  {
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Title is required",
        },
        len: {
          args: [1 - 50],
          msg: "Title must be between 1-50 chars",
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description is required",
        },
        len: {
          args: [1, 255],
          msg: "Description must be between 1-255 chars",
        },
      },
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.1,
      validate: {
        min: 0,
      },
    },
    points_required: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: {
          args: [1, 50],
          msg: "Code must be between 1-50 chars",
        },
      },
    },
    type: {
      type: DataTypes.ENUM("percentage", "fixed", "free_item"),
      allowNull: false,
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
)

export default Reward
