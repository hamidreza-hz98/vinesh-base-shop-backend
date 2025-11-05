// validations/brand.validation.js
const Joi = require("joi");
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const seoSchema = Joi.object({
  title: Joi.string().allow("", null),
  description: Joi.string().allow("", null),
  keywords: Joi.array().items(Joi.string()).default([]),
}).default({});

const BrandValidation = {
  create: Joi.object({
    logo: Joi.string().pattern(objectIdRegex).allow(null),

    tags: Joi.array()
      .items(Joi.string().pattern(objectIdRegex))
      .default([]),

    name: Joi.string().required().trim(),
    englishName: Joi.string().required().trim(),

    slug: Joi.string().allow(null, "").trim(),

    description: Joi.string().allow("", null),

    seo: seoSchema,
  }),

  update: Joi.object({
    logo: Joi.string().pattern(objectIdRegex).allow(null),

    tags: Joi.array()
      .items(Joi.string().pattern(objectIdRegex)),

    name: Joi.string().trim(),
    englishName: Joi.string().trim(),

    slug: Joi.string().trim(),

    description: Joi.string().allow("", null),

    seo: seoSchema,

    visits: Joi.number().min(0),
  }).min(1), // At least one field required on update
};

module.exports = BrandValidation;
