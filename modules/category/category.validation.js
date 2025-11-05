// validations/category.validation.js
const Joi = require("joi");
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const seoSchema = Joi.object({
  title: Joi.string().allow("", null),
  description: Joi.string().allow("", null),
  keywords: Joi.array().items(Joi.string()).default([]),
}).default({});

const categoryValidation = {
  create: Joi.object({
    name: Joi.string().required().trim(),
    slug: Joi.string().allow("", null).trim(),
    description: Joi.string().required().trim(),
    
    image: Joi.string().pattern(objectIdRegex).allow(null),
    children: Joi.array()
      .items(Joi.string().pattern(objectIdRegex))
      .default([]),
    tags: Joi.array()
      .items(Joi.string().pattern(objectIdRegex))
      .default([]),

    seo: seoSchema,
  }),

  update: Joi.object({
    name: Joi.string().trim(),
    slug: Joi.string().trim(),
    description: Joi.string().trim(),

    image: Joi.string().pattern(objectIdRegex).allow(null),
    children: Joi.array().items(Joi.string().pattern(objectIdRegex)),
    tags: Joi.array().items(Joi.string().pattern(objectIdRegex)),

    seo: seoSchema,
    visits: Joi.number().min(0),
  }).min(1), // At least one field required on update
};

module.exports = categoryValidation;
