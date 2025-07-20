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
    onDelete: "CASCADE",
  })
  Card.belongsTo(User, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
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

  //Restaurant

  Restaurant.hasMany(Review, {
    foreignKey: {
      name: "restaurantId",
      allowNull: true,
    },
    onDelete: "CASCADE",
  })
  Review.belongsTo(Restaurant, {
    foreignKey: {
      name: "restaurantId",
      allowNull: true,
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
    onDelete: "CASCADE",
  })
  Dish.belongsTo(Restaurant, {
    foreignKey: {
      name: "restaurantId",
      allowNull: false,
    },
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

  Review.belongsTo(Restaurant, {
    foreignKey: {
      name: "dishId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })
  //Reward
  Reward.belongsToMany(User, {
    through: UserReward,
    foreignKey: {
      name: "rewardId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })
  User.belongsToMany(Reward, {
    through: UserReward,
    foreignKey: {
      name: "userId",
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

  Dish.belongsToMany(Order, {
    through: OrderItem,
    foreignKey: {
      name: "dishId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })
  Order.belongsToMany(Dish, {
    through: OrderItem,

    foreignKey: {
      name: "orderId",
      allowNull: false,
    },
    onDelete: "CASCADE",
  })

  console.log("Successfully made associations")
}
