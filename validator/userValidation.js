const Joi = require("joi");
try {
  module.exports = {
    sendOTP: Joi.object({
      number: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .label("Number")
        .messages({
          "string.base": "{#label} should be in a valid number format",
          "string.length":
            "{#label} should be in a valid number format with 10 digit",
          "any.required": "{#label} is a required field",
        }),
      otp: Joi.string().required().length(4).label("otp")
        .messages({
          "string.base": "{#label} should be a type of 'text'",
        }),
    }),
    verifyOTP: Joi.object({
      number: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .label("Number")
        .messages({
          "string.base": "{#label} should be in a valid number format",
          "string.length":
            "{#label} should be in a valid number format with 10 digit",
          "any.required": "{#label} is a required field",
        }),
      otp: Joi.string().required().length(4).label("otp")
        .messages({
          "string.base": "{#label} should be a type of 'text'",
        }),
      type: Joi.string().label("type").messages({
        "string.base": "{#label} should be a string"
      }),
    }),
    applyforVendor: Joi.object({
      number: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .label("Number")
        .messages({
          "string.base": "{#label} should be in a valid number format",
          "string.length":
            "{#label} should be in a valid number format with 10 digit",
          "any.required": "{#label} is a required field",
        }),
      name: Joi.string().required().label("Name")
        .messages({
          "string.base": "{#label} should be a type of 'text'",
        }),
      businessName: Joi.string().required().label("Business Name")
        .messages({
          "string.base": "{#label} should be a type of 'text'",
        }),
      pinCode: Joi.number().required().label("Pin Code")
        .messages({
          "number.base": "{#label} should be a type of 'number'",
        }),
      city: Joi.string().required().label("City")
        .messages({
          "string.base": "{#label} should be a type of 'text'",
        }),
    }),
  };
} catch (error) {
 return error
}
