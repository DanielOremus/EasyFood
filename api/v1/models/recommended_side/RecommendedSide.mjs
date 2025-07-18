import { DataTypes } from "sequelize"
import { sequelize } from "../../../../config/db.mjs"
import Dish from "../dish/Dish.mjs"

const RecommendedSide = sequelize.define(
  "RecommendedSide",
  {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name is required",
        },
        len: {
          args: [1, 50],
          msg: "Name can container 1-50 chars",
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  { tableName: "recommended_sides", createdAt: false, updatedAt: false }
)

RecommendedSide.belongsTo(Dish, {
  foreignKey: {
    name: "dish_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
})

export default RecommendedSide
