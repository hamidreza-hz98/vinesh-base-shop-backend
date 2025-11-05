// validations/address.validation.js
const Joi = require("joi");

const iranMobileRegex = /^09\d{9}$/;
const iranZipCodeRegex = /^\d{10}$/;

const addressValidation = {
  create: Joi.object({
    name: Joi.string().required().trim(),
    recipientName: Joi.string().trim().allow(""),
    recipientPhone: Joi.string()
      .trim()
      .allow("")
      .pattern(iranMobileRegex)
      .messages({
        "string.pattern.base": "Recipient phone must be a valid Iranian mobile number (e.g. 09123456789)",
      }),
    address: Joi.string().required().trim(),
    zipCode: Joi.string()
      .required()
      .trim()
      .pattern(iranZipCodeRegex)
      .messages({
        "string.pattern.base": "Zip code must be a valid 10-digit Iranian postal code",
      }),

    customer: Joi.string().hex().length(24).required(), // ObjectId

    province: Joi.string().required().trim(),
    city: Joi.string().required().trim(),
  }),

  update: Joi.object({
    name: Joi.string().trim(),
    recipientName: Joi.string().trim().allow(""),
    recipientPhone: Joi.string()
      .trim()
      .allow("")
      .pattern(iranMobileRegex)
      .messages({
        "string.pattern.base": "Recipient phone must be a valid Iranian mobile number (e.g. 09123456789)",
      }),
    address: Joi.string().trim(),
    zipCode: Joi.string()
      .trim()
      .pattern(iranZipCodeRegex)
      .messages({
        "string.pattern.base": "Zip code must be a valid 10-digit Iranian postal code",
      }),

    customer: Joi.string().hex().length(24), // Optional for update

    province: Joi.string().trim(),
    city: Joi.string().trim(),
  }).min(1), // must update at least one field
};

module.exports = addressValidation;
