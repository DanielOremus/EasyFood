import { sequelize } from "../../../../config/db.mjs"
import { DataTypes } from "sequelize"
import Reward from "../reward/Reward.mjs"
import Restaurant from "../restaurant/Restaurant.mjs"
import User from "../user/User.mjs"
import Location from "../location/Location.mjs"

const Order = sequelize.define(
  "Order",
  {
    status: {
      type: DataTypes.ENUM("pending", "preparing", "delivered", "cancelled"),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM("card", "cash"),
      allowNull: false,
    },
    points_used: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    createdAt: "created_at",
    updatedAt: false,
  }
)

Order.belongsTo(Location, {
  foreignKey: {
    name: "delivery_address",
    allowNull: false,
  },
})

Order.belongsTo(User, {
  foreignKey: {
    name: "user_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
})

Order.belongsTo(Restaurant, {
  foreignKey: {
    name: "restaurant_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
})

Order.belongsTo(Reward, {
  foreignKey: {
    name: "reward_applied",
    allowNull: true,
  },
})

export default Order
