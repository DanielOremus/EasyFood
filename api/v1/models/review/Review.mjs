import { DataTypes } from "sequelize"
import { sequelize } from "../../../../config/db.mjs"
import User from "../user/User.mjs"
import Dish from "../dish/Dish.mjs"
import Restaurant from "../restaurant/Restaurant.mjs"

const Review = sequelize.define(
  "Review",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dishId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
      validate: {
        min: 1,
      },
      get() {
        return parseFloat(this.getDataValue("rating"))
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
    updatedAt: false,
    underscored: true,
  }
)

Review.belongsTo(User, {
  onDelete: "SET NULL",
})

Review.belongsTo(Restaurant, {
  onDelete: "CASCADE",
})

Review.belongsTo(Dish, {
  onDelete: "CASCADE",
})

export default Review
