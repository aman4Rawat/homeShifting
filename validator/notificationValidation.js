const Joi = require("joi");
try {
  module.exports = {
    addNotification: Joi.object({
      notification_description : Joi.string().required().trim().min(1).label("Notification Description").messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
      url: Joi.string().required().trim().min(1).label("Url").messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
     
    }),
    updateNotification: Joi.object({
      notification_description : Joi.string().required().trim().min(1).label("Notification Description").messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
      url: Joi.string().required().trim().min(1).label("Url").messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
      updated_at:Joi.object()
     
    }),
  };
} catch (error) {
  console.log(error);
}
