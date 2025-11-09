// validations/customer.validation.js
const Joi = require("joi");

const iranPhoneRegex = /^09\d{9}$/;

const customerValidation = {
  create: Joi.object({
    firstName: Joi.string().required().trim(),
    lastName: Joi.string().required().trim(),
    phone: Joi.string().required().trim(),
    email: Joi.string().email().trim(),
    password: Joi.string(),
    birthdate: Joi.date().allow(null),
  }),

  update: Joi.object({
    firstName: Joi.string().trim(),
    lastName: Joi.string().trim(),
    phone: Joi.string().trim(),
    email: Joi.string().email().trim(),
    password: Joi.string(),
    birthdate: Joi.date(),
  }).min(1), // At least one field required for update

   login: Joi.object({
    phone: Joi.string().pattern(iranPhoneRegex).required().messages({
      "string.pattern.base": "Phone number must be a valid Iranian mobile number (e.g., 09123456789)",
    }),
    password: Joi.string().required(),
  }),
};

module.exports = customerValidation;
