class RestaurantValidator {
  static defaultSchema = {
    name: {
      trim: true,
      notEmpty: {
        errorMessage: "Name is required",
        bail: true,
      },
      isLength: {
        options: {
          max: 255,
        },
        errorMessage: "Name must be at most 255 chars long",
      },
      escape: true,
    },
    address: {
      trim: true,
      notEmpty: {
        errorMessage: "Address is required",
        bail: true,
      },
      isLength: {
        options: {
          max: 255,
        },
        errorMessage: "Address must be at most 255 chars long",
      },
      escape: true,
    },
    lat: {
      notEmpty: {
        errorMessage: "Latitude is required",
        bail: true,
      },
      isFloat: {
        options: {
          min: -90,
          max: 90,
        },
        errorMessage: "Latitude must be a float and its value must be between -90 and 90",
      },
      toFloat: true,
    },
    lng: {
      notEmpty: {
        errorMessage: "Longitude is required",
        bail: true,
      },
      isFloat: {
        options: {
          min: -180,
          max: 180,
        },
        errorMessage: "Longitude must be a float and its value must be between -180 and 180",
      },
      toFloat: true,
    },
    imageUrl: {
      optional: true,
      trim: true,
      notEmpty: {
        errorMessage: "Image url is required",
        bail: true,
      },
      isLength: {
        options: {
          max: 255,
        },
        bail: true,
        errorMessage: "Image url must be at most 255 chars",
      },
      isURL: {
        options: {
          requireTld: true,
        },
        errorMessage: "Image url is invalid",
      },
    },
    openHours: {
      notEmpty: {
        errorMessage: "Open hours are required",
        bail: true,
      },
      isLength: {
        options: {
          max: 255,
        },
        errorMessage: "Open hours must be at most 255 chars long",
      },
      escape: true,
    },
    description: {
      trim: true,
      notEmpty: {
        errorMessage: "Description is required",
        bail: true,
      },
      isLength: {
        options: {
          max: 255,
        },
        errorMessage: "Description must be at most 255 chars long",
      },
      escape: true,
    },
    cuisineType: {
      trim: true,
      notEmpty: {
        errorMessage: "Cuisine type is required",
        bail: true,
      },
      isLength: {
        options: {
          max: 100,
        },
        errorMessage: "Cuisine type be at most 100 chars long",
      },
      escape: true,
    },
  }
}

export default RestaurantValidator
