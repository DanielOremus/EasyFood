import { DataTypes } from "sequelize"
import { sequelize } from "../../../config/db.mjs"

const OrderItemSide = sequelize.define(
  "orderItemSide",
  {
    sideName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    sidePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    underscored: true,
  }
)

export default OrderItemSide
