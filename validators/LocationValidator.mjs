class LocationValidator {
  static defaultSchema = {
    address: {
      trim: true,
      escape: true,
      notEmpty: {
        errorMessage: "Address is required",
      },
      isLength: {
        options: {
          max: 255,
        },
        errorMessage: "Address can contain at most 255 chars",
      },
    },
    lat: {
      isFloat: {
        options: {
          min: -90,
          max: 90,
        },
        errorMessage: "Latitude must a float and be between -90 and 90",
      },
      toFloat: true,
    },
    lng: {
      isFloat: {
        options: {
          min: -180,
          max: 180,
        },
        errorMessage: "Longitude must a float and be between -180 and 180",
      },
      toFloat: true,
    },
  }
}

export default LocationValidator
