import { DataTypes } from "sequelize"
import { sequelize } from "../../../../config/db.mjs"
import User from "../user/User.mjs"
import Dish from "../dish/Dish.mjs"
import Restaurant from "../restaurant/Restaurant.mjs"

const Review = sequelize.define(
  "Review",
  {
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    comment: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Comment is required",
        },
        len: {
          args: [5, 500],
          msg: "Comment must contain 5-500 chars",
        },
      },
    },
  },
  {
    createdAt: "created_at",
    updatedAt: false,
  }
)

Review.belongsTo(User, {
  foreignKey: {
    name: "user_id",
    allowNull: true,
  },
  onDelete: "SET NULL",
})

Review.belongsTo(Dish, {
  foreignKey: {
    name: "dish_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
})

Review.belongsTo(Restaurant, {
  foreignKey: {
    name: "restaurant_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
})

export default Review
