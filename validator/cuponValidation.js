const Joi = require("joi")

try {
    module.exports = {
      add: Joi.object({
        promo_name: Joi.string().required().trim().min(1).label("Coupon Name").messages({
          "string.base": "{#label} should be a type of 'text'",
          "any.required": "{#label} is a required field",
        }),
        expire_at: Joi.required().messages({
          "any.required": "{#label} is a required field",
        }),

        test: Joi.array().label("test").messages({
            "string.base": "{#label} should be a type of 'array'",
          }),
          
        subject: Joi.array().label("subject").messages({
            "string.base": "{#label} should be a type of 'array'",
          }),
        
      }),
      
    };
  } catch (error) {
    console.log(error);
  }