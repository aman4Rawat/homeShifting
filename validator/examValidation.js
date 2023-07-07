const Joi = require("joi");

try {
  module.exports = {
    addExam: Joi.object({
      exam_name: Joi.string().required().trim().min(1).label("Exam Name").messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
      
      exam_description: Joi.string().required().trim().min(1).label("Exam Description").messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
      exam_category: Joi.array().label("exam_category").messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
      exam_type: Joi.string().label("Exam Type").messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
      
    }),
    deleteExam: Joi.object({
      is_active: Joi.boolean().required().label("is Active").messages({
        "string.base": "{#label} should be a type of 'boolean'",
        "any.required": "{#label} is a required field",
      }),
    }),
    updateExam: Joi.object({
      exam_name: Joi.string().required().trim().min(1).label("Exam Name").messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
      
      exam_description: Joi.string().trim().min(1).required().label("Exam Description").messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
      updated_at:Joi.object()
     
      
    }),
  };
} catch (error) {
  console.log(error);
}
