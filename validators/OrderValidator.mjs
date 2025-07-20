import CustomIdValidator from "../utils/CustomIdValidator.mjs"
import order from "../config/order.mjs"

class OrderValidator {
  static defaultSchema = {
    restaurantId: {
      custom: {
        options: (v) => {
          const validator = new CustomIdValidator("Restaurant ID")
          validator.validate(v)
          return true
        },
      },
    },
    items: {
      isArray: {
        options: {
          min: 1,
        },
        bail: true,
        errorMessage: "Items must be an array and contain at least 1 element",
      },
      custom: {
        options: (v) => {
          for (const item of v) {
            if (
              !Object.hasOwn(item, "dishId") ||
              !Object.hasOwn(item, "quantity")
            )
              throw new Error("Items have an item with invalid structure")

            const { dishId, quantity } = item

            const dishIdErrMsg = "Items have an item with invalid Dish ID"
            const dishIdValidator = new CustomIdValidator("ID", {
              NOT_PROVIDED: dishIdErrMsg,
              NOT_INT: dishIdErrMsg,
              NEGATIVE_INT: dishIdErrMsg,
              UNSUPPORTED_TYPE: dishIdErrMsg,
            })

            dishIdValidator.validate(dishId)

            const sanitizedQuantity = parseInt(quantity)
            if (!Number.isInteger(sanitizedQuantity) || sanitizedQuantity <= 0)
              throw new Error(
                `Items have an item with invalid quantity: '${quantity}'`
              )

            return true
          }
        },
      },
      customSanitizer: {
        options: (v) => {
          const result = v.map((item) => ({
            ...item,
            quantity: parseInt(item.quantity),
          }))
          return result
        },
      },
    },
    deliveryAddress: {
      trim: true,
      escape: true,
      notEmpty: {
        errorMessage: "Delivery address is required",
        bail: true,
      },
      isLength: {
        options: {
          min: 5,
          max: 255,
        },
        errorMessage:
          "Delivery address must be at least 5 and at most 255 chars long",
      },
    },
    paymentMethod: {
      trim: true,
      toLowerCase: true,
      notEmpty: {
        errorMessage: "Payment method is required",
        bail: true,
      },
      custom: {
        options: (v) => {
          const allowedMethods = order.paymentMethods
          if (!allowedMethods.includes(v))
            throw new Error(
              `Payment method '${v}' is not supported! Supported methods: ${allowedMethods.join(
                ", "
              )}`
            )
          return true
        },
      },
    },
    cardId: {
      custom: {
        options: (v, { req }) => {
          if (req.body.paymentMethod !== "card") return true
          const validator = new CustomIdValidator("Card ID")
          validator.validate(v)

          return true
        },
      },
    },
    usePoints: {
      optional: true,
      isInt: {
        options: {
          min: 0,
        },
        errorMessage: "Points number must be an non negative integer",
      },
      toInt: true,
    },
    rewardCode: {
      optional: true,
      trim: true,
      notEmpty: {
        errorMessage: "Reward code cannot be empty",
        bail: true,
      },
      isLength: {
        options: {
          max: 50,
        },
        errorMessage: "Reward code can be at most 50 chars long",
      },
    },
  }
  static statusSchema = {
    status: {
      notEmpty: {
        errorMessage: "Status is required",
        bail: true,
      },
      custom: {
        options: (v) => {
          const statuses = Object.values(order.statuses)
          if (!statuses.includes(v))
            throw new Error(`Order status '${v}' is not supported`)
          return true
        },
      },
    },
  }
}

export default OrderValidator
