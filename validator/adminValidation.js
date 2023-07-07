const Joi = require("joi");
try {
  module.exports = {
    addAdmin: Joi.object({
      name: Joi.string().required().label("Name").messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
      mobile_number: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .label("Mobile Number")
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
      email: Joi.string().required().messages({
        "string.base": "{#label} should be a type of 'text'",
        "string.email": "{#label} should be in a valid email format",
        "any.required": "{#label} is a required field",
      }),
      password: Joi.string()
        .required()
        .messages({
          "string.base": "{#label} should be a type of 'text'",
        }),
    }),
  };
} catch (error) {
  console.log(error);
}
