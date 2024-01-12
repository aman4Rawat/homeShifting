const Joi = require("joi");
try {
  module.exports = {
    addAdmin: Joi.object({
      name: Joi.string().required().label("Name").messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
      gender: Joi.string().label("Gender").messages({
        "string.base": "{#label} should be a type of 'text'",
      }),
      mobile_number: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .label("Number")
        .messages({
          "string.base": "{#label} should be in a valid number format",
          "string.length":
            "{#label} should be in a valid number format with 10 digit",
          "any.required": "{#label} is a required field",
        }),
      email: Joi.string().required().messages({
        "string.base": "{#label} should be a type of 'text'",
        "string.email": "{#label} should be in a valid email format",
        "any.required": "{#label} is a required field",
      }),
      password: Joi.string()
        .pattern(
          /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#.])[A-Za-z\d$@$!%*?&.]{8,20}/
        )
        .required()
        .messages({
          "string.base": "{#label} should be a type of 'text'",
          "string.pattern.base":
            "{#label} should be in a valid password of min 8 letter length, with at least a symbol, upper and lower case letters and a number",
          "any.required": "{#label} is a required field",
        }),
    }),
    loginAdmin: Joi.object({
      email: Joi.string()
        .required()
        .email({ tlds: { allow: false } })
        .messages({
          "string.base": "{#label} should be a type of 'text'",
          "string.email": "{#label} should be in a valid email format",
          "any.required": "{#label} is a required field",
        }),
      password: Joi.string().required().messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
    }),
    createPackageValidation: Joi.object({
      packageName: Joi.string().required().label("packageName").messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
      packageAmount: Joi.number().required().label("packageAmount").messages({
        "number.base": "{#label} should be a type of 'number'",
        "any.required": "{#label} is a required field",
      }),
      packageDuration: Joi.number()
        .required()
        .label("packageDuration")
        .messages({
          "number.base": "{#label} should be a type of 'number'",
          "any.required": "{#label} is a required field",
        }),
      packageDetails: Joi.array().required().label("packageDetails").messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
      callCharges: Joi.number().required().label("callCharges").messages({
        "number.base": "{#label} should be a type of 'number'",
        "any.required": "{#label} is a required field",
      }),
      socialMediaCharges: Joi.number()
        .required()
        .label("socialMediaCharges")
        .messages({
          "number.base": "{#label} should be a type of 'number'",
          "any.required": "{#label} is a required field",
        }),
      bestDealCharges: Joi.number()
        .required()
        .label("bestDealCharges")
        .messages({
          "number.base": "{#label} should be a type of 'number'",
          "any.required": "{#label} is a required field",
        }),
      websiteCharges: Joi.number().required().label("websiteCharges").messages({
        "number.base": "{#label} should be a type of 'number'",
        "any.required": "{#label} is a required field",
      }),
      directionCharges: Joi.number()
        .required()
        .label("directionCharges")
        .messages({
          "number.base": "{#label} should be a type of 'number'",
          "any.required": "{#label} is a required field",
        }),
      inqueryCharges: Joi.number().required().label("inqueryCharges").messages({
        "number.base": "{#label} should be a type of 'number'",
        "any.required": "{#label} is a required field",
      }),
      othersCharges: Joi.number().required().label("othersCharges").messages({
        "number.base": "{#label} should be a type of 'number'",
        "any.required": "{#label} is a required field",
      }),
      chatCharges: Joi.number().required().label("chatCharges").messages({
        "number.base": "{#label} should be a type of 'number'",
        "any.required": "{#label} is a required field",
      }),
    }),
  };
} catch (error) {
  return error;
}
