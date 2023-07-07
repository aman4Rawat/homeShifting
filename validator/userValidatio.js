const Joi = require("joi");

try {
  module.exports = {
    addUser: Joi.object({
      fullName: Joi.string().required().label("Name").messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
      mobileNumber: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .label("Mobile Number")
        .required()
        .messages({
          "string.base": "{#label} should be in a valid number format",
          "string.length":
            "{#label} should be in a valid number format with 10 digit",
          "any.required": "{#label} is a required field",
        }),
      email: Joi.string().email().required().label("Email").messages({
        "string.base": "{#label} should be a type of 'text'",
        "string.email": "{#label} should be in a valid format",
        "any.required": "{#label} is a required field",
      }),
      DOB: Joi.date().label("DOB").required().messages({
        "date.base": "{#label} should be a type of 'Valid Date'",
        "any.required": "{#label} is a required field",
      }),
      highestQualification: Joi.string().required()
      .label("Highest Qualification")
      .messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
    serviceCategoryOfParent: Joi.string().allow(null, '')
      .label("Service Category Of Parent")
      .messages({
        "string.base": "{#label} should be a type of 'text'",
      }),
    gender: Joi.string()
      .label("Service Category Of Parents")
      .messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
    category: Joi.string().label("Category").required().messages({
      "string.base": "{#label} should be a type of 'text'",
      "any.required": "{#label} is a required field",
    }),
      password: Joi.string()
        .pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d!"#$%&'()*+,-.:;<=>?@[\]^_`{|}~"]{8,16}$/
        )
        .required()
        .messages({
          "string.base": "{#label} should be a type of 'text'",
          "string.pattern.base":
            "{#label} should be in a valid password of min 8 letter length, with at least a symbol, upper and lower case letters and a number",
          "any.required": "{#label} is a required field",
        }),
    }),
    loginUser: Joi.object({
      email: Joi.string().required().email().label("Email").messages({
        "string.email": "{#label} should be in a valid format",
      }),
      password: Joi.string().required(),
    }),
    updateUser: Joi.object({
      fullName: Joi.string().required().trim().min(1).label("Name").messages({
        "string.base": "{#label} should be a type of 'text'",
      }),
      mobileNumber: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .label("Mobile Number")
        .messages({
          "string.base": "{#label} should be in a valid number format",
          "string.length":
            "{#label} should be in a valid number format with 10 digit",
        }),
      // email: Joi.string().email().messages({
      //   "string.base": "{#label} should be a type of 'text'",
      //   "string.email": "{#label} should be in a valid email format",
      // }),
      DOB: Joi.date().label("DOB").messages({
        "date.base": "{#label} should be a type of 'Valid Date'",
      }),
      highestQualification: Joi.string()
        .label("Highest Qualification")
        .messages({
          "string.base": "{#label} should be a type of 'text'",
        }),
      serviceCategoryOfParent: Joi.string().allow(null, '')
        .label("Service Category Of Parents")
        .messages({
          "string.base": "{#label} should be a type of 'text'",
        }),
      category: Joi.string().label("Category").messages({
        "string.base": "{#label} should be a type of 'text'",
      }),
      gender: Joi.string().label("Gender").messages({
        "string.base": "{#label} should be a type of 'text'",
      }),
    }),
    // password: Joi.object({
    //   password: Joi.string()
    //     .pattern(
    //       /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#.])[A-Za-z\d$@$!%*?&.]{8,20}/
    //     )
    //     .required()
    //     .messages({
    //       "string.base": "{#label} should be a type of 'text'",
    //       "string.pattern.base":
    //         "{#label} should be in a valid password of min 8 letter length, with at least a symbol, upper and lower case letters and a number",
    //       "any.required": "{#label} is a required field",
    //     }),
    // }),
  };
} catch (error) {
  console.log(error);
}
