const Joi = require("joi");
const mongoose = require("mongoose");

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

const mediaSchema = {
  upload: Joi.object({
    title: Joi.string().allow("", null),
    description: Joi.string().allow("", null),
    seoTitle: Joi.string().allow("", null),
    seoDescription: Joi.string().allow("", null),
    seoKeywords: Joi.string().allow("", null),
    mediaAlt: Joi.string().allow("", null),
    mediaTitle: Joi.string().allow("", null),
    mediaCaption: Joi.string().allow("", null),
    mediaTranscript: Joi.string().allow("", null),
  }),

  update: Joi.object({
    title: Joi.string().allow("", null),
    description: Joi.string().allow("", null),
    seoTitle: Joi.string().allow("", null),
    seoDescription: Joi.string().allow("", null),
    seoKeywords: Joi.string().allow("", null),
    mediaAlt: Joi.string().allow("", null),
    mediaTitle: Joi.string().allow("", null),
    mediaCaption: Joi.string().allow("", null),
    mediaTranscript: Joi.string().allow("", null),
  }),

  getDetails: Joi.object({
    _id: objectId,
    slug: Joi.string().lowercase(),
  }).or("_id", "slug"),
};

module.exports = { mediaSchema };
