// validations/product.validation.js
const seoValidationSchema = require("../../constants/seo-validation-schema");
const Joi = require("joi");
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const specificationSchema = Joi.object({
  key: Joi.string().required(),
  value: Joi.string().required(),
});

const productValidation = {
  create: Joi.object({
    title: Joi.string().required().trim(),
    slug: Joi.string().allow("", null).trim(), // optional; can be auto-generated
    excerpt: Joi.string().required().trim(),

    price: Joi.number().required().min(0).default(0),
    discount: Joi.number().min(0).default(0),
    description: Joi.string().allow("", null),

    media: Joi.array().items(Joi.string().pattern(objectIdRegex)).default([]),

    stock: Joi.number().required().min(0).default(0),
    relatedProducts: Joi.array()
      .items(Joi.string().pattern(objectIdRegex))
      .default([]),

    visits: Joi.number().min(0).default(0),
    tags: Joi.array().items(Joi.string().pattern(objectIdRegex)).default([]),
    categories: Joi.array()
      .items(Joi.string().pattern(objectIdRegex))
      .min(1)
      .required(),
    brand: Joi.string().pattern(objectIdRegex).allow(null),

    soldNumber: Joi.number().min(0).default(0),

    shortSpecifications: Joi.array().items(specificationSchema).default([]),
    specifications: Joi.array().items(specificationSchema).default([]),

    seo: seoValidationSchema,
  }),

  update: Joi.object({
    title: Joi.string().trim(),
    slug: Joi.string().trim(),
    excerpt: Joi.string().trim(),

    price: Joi.number().min(0),
    discount: Joi.number().min(0),
    description: Joi.string().allow("", null),

    media: Joi.array().items(Joi.string().pattern(objectIdRegex)),
    stock: Joi.number().min(0),
    relatedProducts: Joi.array().items(Joi.string().pattern(objectIdRegex)),

    visits: Joi.number().min(0),
    tags: Joi.array().items(Joi.string().pattern(objectIdRegex)),
    categories: Joi.array().items(Joi.string().pattern(objectIdRegex)),
    brand: Joi.string().pattern(objectIdRegex).allow(null),

    soldNumber: Joi.number().min(0),

    shortSpecifications: Joi.array().items(specificationSchema),
    specifications: Joi.array().items(specificationSchema),

    seo: seoValidationSchema,
  }).min(1), // At least one field must be updated
};

module.exports = productValidation;
