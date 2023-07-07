const Joi = require("joi");
try {
  module.exports = {
    addQuestionsCategory: Joi.object({
      category_name: Joi.string().required().trim().min(1).label("Category Name").messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
    }),
    updateCategorydata: Joi.object({
      category_name: Joi.string()
        .required()
        .trim()
        .min(1)
        .label("Category Name")
        .messages({
          "string.base": "{#label} should be a type of 'text'",
          "any.required": "{#label} is a required field",
        }),
    }),
  };
} catch (error) {
  console.log(error);
}
