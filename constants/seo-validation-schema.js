const Joi = require("joi");
const mongoose = require("mongoose");

// Custom Joi validator for Mongo ObjectId
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

const seoValidationSchema = Joi.object({
  title: Joi.string().allow("").max(255),
  description: Joi.string().allow(""),
  keywords: Joi.string().allow(""),
  ogTitle: Joi.string().allow("").max(255),
  ogDescription: Joi.string().allow(""),
  ogImage: objectId.allow(null),
  twitterTitle: Joi.string().allow("").max(255),
  twitterDescription: Joi.string().allow(""),
  twitterImage: objectId.allow(null),
  canonical: Joi.string().allow("").uri({ allowRelative: true }),
  robots: Joi.string().allow(""),
  additionalMetaTags: Joi.string().allow(""),
});

module.exports = seoValidationSchema;
