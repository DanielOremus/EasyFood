import { DataTypes } from "sequelize"
import { sequelize } from "../../../../db/connectToDb.mjs"
import bcrypt from "bcrypt"

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Username is required",
        },
        len: {
          args: [1, 50],
          msg: "Username must be between 1-50 chars",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Email is required",
        },
        len: {
          args: [1, 100],
          msg: "Email must be between 1-100 chars",
        },
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Phone is required",
        },
        len: {
          args: [10, 20],
          msg: "Phone must be between 10-20 chars",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true,
      notEmpty: {
        msg: "Avatar url is required",
      },
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    createdAt: "created_at",
    updatedAt: false,
    hooks: {
      async beforeCreate(user) {
        user.password = await bcrypt.hash(user.password, 10)
      },
      async beforeUpdate(user) {
        if (user.changed("password"))
          user.password = await bcrypt.hash(user.password, 10)
      },
    },
  }
)

await User.sync()

export default User
