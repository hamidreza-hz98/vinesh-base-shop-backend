// validations/admin.validation.js
const Joi = require("joi");

const adminValidation = {
  create: Joi.object({
    firstName: Joi.string().required().trim(),
    lastName: Joi.string().required().trim(),
    username: Joi.string()
      .required()
      .trim()
      .lowercase()
      .min(4)
      .pattern(/^[a-z0-9._]+$/)
      .messages({
        "string.pattern.base":
          "Username can only contain lowercase letters, numbers, dots and underscores",
      }),
    password: Joi.string().required().min(6),
  }),

  update: Joi.object({
    firstName: Joi.string().trim(),
    lastName: Joi.string().trim(),
    username: Joi.string()
      .trim()
      .lowercase()
      .min(4)
      .pattern(/^[a-z0-9._]+$/)
      .messages({
        "string.pattern.base":
          "Username can only contain lowercase letters, numbers, dots and underscores",
      }),
    password: Joi.string().min(6),
  }).min(1), // must update at least one field

  login: Joi.object({
    username: Joi.string().required().trim().lowercase(),
    password: Joi.string().required(),
  }),
};

module.exports = adminValidation;
