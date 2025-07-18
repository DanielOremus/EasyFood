import { sequelize } from "../../../../config/db.mjs"
import { DataTypes } from "sequelize"
import Restaurant from "../restaurant/Restaurant.mjs"

const Dish = sequelize.define(
  "Dish",
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
          msg: "Name must be between 1-50 chars",
        },
      },
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description is required",
        },
        len: {
          args: [1, 500],
          msg: "Description must be between 1-500 chars",
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.0,
      },
    },
    img_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    kcal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    proteins: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    carbs: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    fats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: "Category is required",
        len: {
          args: [1, 255],
          msg: "Category must be between 1-255 chars",
        },
      },
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
)

Dish.belongsTo(Restaurant, {
  foreignKey: {
    name: "restaurant_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
})

export default Dish
