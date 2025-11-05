// validations/tag.validation.js
const Joi = require("joi");

const tagValidation = {
  create: Joi.object({
    name: Joi.string().required().trim(),
    slug: Joi.string().allow("", null).trim(), // optional; can be auto-generated
  }),

  update: Joi.object({
    name: Joi.string().trim(),
    slug: Joi.string().trim(),
  }).min(1), // At least one field required on update
};

module.exports = tagValidation;
