class UserValidator {
  static registerSchema = {
    username: {
      trim: true,
      escape: true,
      notEmpty: {
        errorMessage: "Username is required",
        bail: true,
      },
      isLength: {
        options: {
          min: 1,
          max: 50,
        },
        errorMessage: "Username must be at least 1 and at most 50 chars long",
      },
    },
    email: {
      trim: true,
      notEmpty: {
        errorMessage: "Email is required",
        bail: true,
      },
      isEmail: {
        errorMessage: "Invalid email format",
      },
      normalizeEmail: true,
    },
    phone: {
      trim: true,
      notEmpty: {
        errorMessage: "Phone number is required",
        bail: true,
      },
      isMobilePhone: {
        locale: "any",

        errorMessage: "Phone number is invalid",
      },
    },
    password: {
      trim: true,
      notEmpty: {
        errorMessage: "Password is required",
        bail: true,
      },
      isLength: {
        options: {
          min: 3,
          max: 16,
        },
        errorMessage: "Password must be at least 3 and at most 16 chars long",
      },
    },
  }
  static loginSchema = {
    email: {
      trim: true,
      notEmpty: {
        errorMessage: "Email is required",
        bail: true,
      },
      isEmail: {
        errorMessage: "Invalid email format",
      },
      normalizeEmail: true,
    },
    password: {
      trim: true,
      notEmpty: {
        errorMessage: "Password is required",
      },
    },
  }
  static newPasswordSchema = {
    password: {
      trim: true,
      notEmpty: {
        errorMessage: "Password is required",
      },
    },
    newPassword: {
      trim: true,
      notEmpty: {
        errorMessage: "New password is required",
        bail: true,
      },
      isLength: {
        options: {
          min: 3,
          max: 16,
        },
        errorMessage:
          "New password must be at least 3 and at most 16 chars long",
      },
    },
  }
  static updateSchema = {
    username: {
      trim: true,
      escape: true,
      notEmpty: {
        errorMessage: "Username is required",
        bail: true,
      },
      isLength: {
        options: {
          min: 1,
          max: 50,
        },
        errorMessage: "Username must be at least 1 and at most 50 chars long",
      },
    },
    phone: {
      trim: true,
      notEmpty: {
        errorMessage: "Phone number is required",
        bail: true,
      },
      isMobilePhone: {
        locale: "any",

        errorMessage: "Phone number is invalid",
      },
    },
    avatarUrl: {
      optional: true,
      notEmpty: {
        errorMessage: "Avatar url is required",
        bail: true,
      },
      isLength: {
        options: {
          max: 255,
        },
        bail: true,
        errorMessage: "Avatar url must be at most 255 chars",
      },
      isURL: {
        options: {
          require_tld: true,
        },
        errorMessage: "Avatar url is invalid",
      },
    },
  }
}

export default UserValidator
