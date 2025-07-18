import { DataTypes } from "sequelize"
import { sequelize } from "../../../../config/db.mjs"
import Dish from "../dish/Dish.mjs"
import Order from "../order/Order.mjs"

const OrderItem = sequelize.define(
  "OrderItem",
  {
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
    tableName: "order_items",
    createdAt: false,
    updatedAt: false,
  }
)

OrderItem.belongsTo(Order, {
  foreignKey: {
    name: "order_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
})
OrderItem.belongsTo(Dish, {
  foreignKey: {
    name: "dish_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
})

export default OrderItem
