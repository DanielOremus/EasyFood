import { DataTypes } from "sequelize"
import { sequelize } from "../../../../config/db.mjs"
import Dish from "../dish/Dish.mjs"
import Order from "../order/Order.mjs"

const OrderItem = sequelize.define(
  "OrderItem",
  {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dishId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    underscored: true,
  }
)

OrderItem.belongsTo(Order, {
  onDelete: "CASCADE",
})

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" })

OrderItem.belongsTo(Dish, {
  onDelete: "CASCADE",
})

Dish.hasMany(OrderItem, { as: "orderItems" })

export default OrderItem
