import { DataTypes } from "sequelize"
import { sequelize } from "../../../../config/db.mjs"
import { hashPassword } from "../../../../middlewares/password.mjs"

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING(50),
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
      type: DataTypes.STRING(100),
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
      type: DataTypes.STRING(20),
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
      beforeCreate: async (user) => {
        user.password = await hashPassword(user.password)
      },
      beforeUpdate: async (user) => {
        console.log(user)

        if (user.changed("password"))
          user.dataValues.password = await hashPassword(
            user.dataValues.password
          )
      },
    },
  }
)

export default User
