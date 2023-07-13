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
    }),
  };
} catch (error) {
 return error
}
