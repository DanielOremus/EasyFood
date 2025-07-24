import Location from "./location/Location.mjs"
import User from "./user/User.mjs"
import Restaurant from "./restaurant/Restaurant.mjs"
import Dish from "./dish/Dish.mjs"
import UserReward from "./user_reward/UserReward.mjs"
import Card from "./card/Card.mjs"
import Review from "./review/Review.mjs"
import Order from "./order/Order.mjs"
import OrderItem from "./order_item/OrderItem.mjs"
import Side from "./side/Side.mjs"
import Reward from "./reward/Reward.mjs"
import Category from "./category/Category.mjs"
import Subcategory from "./subcategory/Subcategory.mjs"

export default function () {
  //User
  User.hasMany(Location, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })
  Location.belongsTo(User, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })

  User.hasMany(Card, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    as: "cards",
    onDelete: "CASCADE",
  })
  Card.belongsTo(User, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    as: "cards",
    onDelete: "CASCADE",
  })

  User.hasMany(Order, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })
  Order.belongsTo(User, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })

  User.hasMany(Review, {
    foreignKey: {
      name: "userId",
      allowNull: true,
    },
    onDelete: "SET NULL",
  })

  Review.belongsTo(User, {
    foreignKey: {
      name: "userId",
      allowNull: true,
    },
    onDelete: "SET NULL",
  })

  User.hasMany(UserReward, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })

  UserReward.belongsTo(User, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })

  Reward.hasMany(UserReward, {
    foreignKey: {
      name: "rewardId",
      allowNull: false,
    },
    as: "reward",
    onDelete: "CASCADE",
  })
  UserReward.belongsTo(Reward, {
    foreignKey: {
      name: "rewardId",
      allowNull: false,
    },
    as: "reward",
    onDelete: "CASCADE",
  })

  Category.hasMany(Reward, {
    foreignKey: {
      name: "applyCategoryId",
      allowNull: true,
    },
  })

  Reward.belongsTo(Category, {
    foreignKey: {
      name: "applyCategoryId",
      allowNull: true,
    },
  })

  Subcategory.hasMany(Reward, {
    foreignKey: {
      name: "applySubcategoryId",
      allowNull: true,
    },
  })

  Reward.belongsTo(Subcategory, {
    foreignKey: {
      name: "applySubcategoryId",
      allowNull: true,
    },
  })
  //Restaurant

  Restaurant.hasMany(Review, {
    foreignKey: {
      name: "restaurantId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })
  Review.belongsTo(Restaurant, {
    foreignKey: {
      name: "restaurantId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })

  Restaurant.hasMany(Order, {
    foreignKey: {
      name: "restaurantId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })

  Order.belongsTo(Restaurant, {
    foreignKey: {
      name: "restaurantId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })

  Restaurant.hasMany(Dish, {
    foreignKey: {
      name: "restaurantId",
      allowNull: false,
    },
    as: "dishes",
    onDelete: "CASCADE",
  })
  Dish.belongsTo(Restaurant, {
    foreignKey: {
      name: "restaurantId",
      allowNull: false,
    },
    as: "dishes",
    onDelete: "CASCADE",
  })
  //Dish

  Dish.hasMany(Side, {
    foreignKey: {
      name: "dishId",
      allowNull: false,
    },

    onDelete: "CASCADE",
  })
  Side.belongsTo(Dish, {
    foreignKey: {
      name: "dishId",
      allowNull: false,
    },

    onDelete: "CASCADE",
  })

  Dish.hasMany(Review, {
    foreignKey: {
      name: "dishId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })

  Review.belongsTo(Dish, {
    foreignKey: {
      name: "dishId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })

  //Order

  Order.hasMany(OrderItem, {
    foreignKey: { name: "orderId", allowNull: false },
    as: "items",
    onDelete: "CASCADE",
  })
  OrderItem.belongsTo(Order, {
    foreignKey: { name: "orderId", allowNull: false },
    as: "items",
    onDelete: "CASCADE",
  })

  Dish.hasMany(OrderItem, {
    foreignKey: { name: "dishId", allowNull: true },
    onDelete: "SET NULL",
  })

  OrderItem.belongsTo(Dish, {
    foreignKey: { name: "dishId", allowNull: true },
    onDelete: "SET NULL",
  })

  //Categories

  Subcategory.hasMany(Dish, {
    foreignKey: {
      name: "subcategoryId",
      allowNull: false,
    },
  })
  Dish.belongsTo(Subcategory, {
    foreignKey: {
      name: "subcategoryId",
      allowNull: false,
    },
  })

  Category.hasMany(Subcategory, {
    foreignKey: {
      name: "categoryId",
      allowNull: false,
    },
  })

  Subcategory.belongsTo(Category, {
    foreignKey: {
      name: "categoryId",
      allowNull: false,
    },
  })

  console.log("Successfully made associations")
}
