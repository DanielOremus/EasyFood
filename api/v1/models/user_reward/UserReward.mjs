import { DataTypes } from "sequelize"
import { sequelize } from "../../../../config/db.mjs"
import User from "../user/User.mjs"
import Reward from "../reward/Reward.mjs"

const UserReward = sequelize.define(
  "UserReward",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rewardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isClaimed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    claimedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    underscored: true,
  }
)

UserReward.belongsTo(User, {
  onDelete: "CASCADE",
})
User.hasMany(UserReward)
UserReward.belongsTo(Reward, {
  onDelete: "CASCADE",
})
Reward.hasMany(UserReward)

export default UserReward
