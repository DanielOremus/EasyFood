import CustomIdValidator from "../utils/CustomIdValidator.mjs"

class ReviewValidator {
  static defaultSchema = {
    // restaurantId: {
    //   custom: {
    //     options: (v) => {
    //       const validator = new CustomIdValidator("Restaurant ID")
    //       validator.validate(v)
    //       return true
    //     },
    //   },
    // },
    rating: {
      trim: true,
      notEmpty: {
        errorMessage: "Rating is required",
        bail: true,
      },
      isFloat: {
        options: {
          min: 0,
          max: 5,
        },
        errorMessage: "Rating must be a float with value 0-5",
      },
      toFloat: true,
    },
    comment: {
      trim: true,
      escape: true,
      notEmpty: {
        errorMessage: "Comment is required",
        bail: true,
      },
      isLength: {
        options: {
          max: 500,
        },
        errorMessage: "Comment must be at most 500 chars long",
      },
    },
  }
}

export default ReviewValidator
