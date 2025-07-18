import Location from "../api/v1/models/location/Location.mjs"
import Reward from "../api/v1/models/reward/Reward.mjs"
import User from "../api/v1/models/user/User.mjs"
import Dish from "../api/v1/models/dish/Dish.mjs"
import Restaurant from "../api/v1/models/restaurant/Restaurant.mjs"
import Order from "../api/v1/models/order/Order.mjs"
import OrderItem from "../api/v1/models/order_item/OrderItem.mjs"
import Review from "../api/v1/models/review/Review.mjs"
import UserReward from "../api/v1/models/user_reward/UserReward.mjs"
import Card from "../api/v1/models/card/Card.mjs"
import RecommendedSide from "../api/v1/models/recommended_side/RecommendedSide.mjs"

export default function () {
  const promises = [
    Dish.sync(),
    RecommendedSide.sync(),
    Reward.sync(),
    User.sync(),
    Location.sync(),
    UserReward.sync(),
    Card.sync(),
    Restaurant.sync(),
    Order.sync(),
    OrderItem.sync(),
    Review.sync(),
  ]
  Promise.all(promises)
    .then((values) => {
      console.log("Successfully synced all tables")
    })
    .catch((err) => {
      console.log("Failed to sync tables")
      console.log(err)
      process.exit(1)
    })
}
