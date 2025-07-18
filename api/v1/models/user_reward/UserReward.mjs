import { DataTypes } from "sequelize"
import { sequelize } from "../../../../config/db.mjs"
import User from "../user/User.mjs"
import Reward from "../reward/Reward.mjs"

const UserReward = sequelize.define(
  "UserReward",
  {
    is_claimed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    claimed_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "user_rewards",
    createdAt: false,
    updatedAt: false,
  }
)

UserReward.belongsTo(User, {
  foreignKey: {
    name: "user_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
})
UserReward.belongsTo(Reward, {
  foreignKey: {
    name: "user_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
})

export default UserReward
