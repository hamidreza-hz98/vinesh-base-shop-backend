const Joi = require("joi");

const contactValidation = {
  submit: Joi.object({
    fullName: Joi.string().min(3).max(80).required().messages({
      "string.empty": "Full name is required",
      "string.min": "Full name must be at least 3 characters",
      "string.max": "Full name must be less than 80 characters",
      "any.required": "Full name is required",
    }),

    mobile: Joi.string()
      .trim()
      .pattern(/^09[0-9]{9}$/)
      .required()
      .messages({
        "string.empty": "Mobile number is required",
        "string.pattern.base": "Invalid Iranian mobile number",
        "any.required": "Mobile number is required",
      }),

    message: Joi.string().min(5).max(2000).required().messages({
      "string.empty": "Message is required",
      "string.min": "Message must be at least 5 characters",
      "string.max": "Message must be less than 2000 characters",
      "any.required": "Message is required",
    }),
  }),
};

module.exports = contactValidation;
