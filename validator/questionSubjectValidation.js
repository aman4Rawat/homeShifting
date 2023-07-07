const Joi = require("joi");
try {
  module.exports = {
    addQuestionSubject: Joi.object({
        questionSubject_name: Joi.string().required().trim().min(1).label("Subject Name").messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
      questionSubject_description: Joi.string().required().trim().min(1).label("Subject Description").messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
      syllabus: Joi.string().required().trim().min(1).label("Syllabus").messages({
        "string.base": "{#label} should be a type of 'text'",
        "any.required": "{#label} is a required field",
      }),
    }),
    updateQuestionSubject: Joi.object({
      questionSubject_name: Joi.string().required().trim().min(1).label("Subject Name").messages({
      "string.base": "{#label} should be a type of 'text'",
      "any.required": "{#label} is a required field",
    }),
    questionSubject_description: Joi.string().required().trim().min(1).label("Subject Description").messages({
      "string.base": "{#label} should be a type of 'text'",
      "any.required": "{#label} is a required field",
    }),
    syllabus: Joi.string().required().trim().min(1).label("Syllabus").messages({
      "string.base": "{#label} should be a type of 'text'",
      "any.required": "{#label} is a required field",
    }), 
    updated_at:Joi.object()
  }),
  };
} catch (error) {
  console.log(error);
}
