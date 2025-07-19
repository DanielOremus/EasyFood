import { sequelize } from "../../../../config/db.mjs"
import { DataTypes } from "sequelize"
import Restaurant from "../restaurant/Restaurant.mjs"
import Reward from "../reward/Reward.mjs"
import User from "../user/User.mjs"

const Order = sequelize.define(
  "Order",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deliveryAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Delivery address is required",
        },
      },
    },

    paymentMethod: {
      type: DataTypes.ENUM("card", "cash"),
      allowNull: false,
    },
    pointsUsed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },

    rewardApplied: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("pending", "preparing", "delivered", "cancelled"),
      allowNull: false,
    },
  },
  {
    updatedAt: false,
    underscored: true,
  }
)

Order.belongsTo(User, {
  onDelete: "CASCADE",
})
Order.belongsTo(Restaurant, {
  onDelete: "CASCADE",
})

Order.belongsTo(Reward, {
  foreignKey: "rewardApplied",
  onDelete: "SET NULL",
})

export default Order
