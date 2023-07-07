const Joi = require("joi");

try {
  module.exports = {
    createOrder: Joi.object({
      amount: Joi.number().required().label("Amount").messages({
        "number.base": "{#label} should be a type of 'Number",
        "any.required": "{#label} is a required field",
      }),
      currency: Joi.string().required().label("INR").messages({
        "string.base": "{#label} should be a type of 'String",
        "any.required": "{#label} is a required field",
      }),
      type: Joi.string().required().label("Type").messages({
        "string.base": "{#label} should be a type of 'String",
        "any.required": "{#label} is a required field",
      }),
      examID: Joi.string().label("Exam ID").messages({
        "string.base": "{#label} should be a type of 'String",
      }),
      subjectID: Joi.string().label("Subject ID").messages({
        "string.base": "{#label} should be a type of 'String",
      }),
      testID: Joi.string().label("Test ID").messages({
        "string.base": "{#label} should be a type of 'String",
      }),
      discountcode: Joi.string().label("Discount Code").messages({
        "string.base": "{#label} should be a type of 'String",
      }),
    }),
  };
} catch (error) {
  console.log(error);
}
