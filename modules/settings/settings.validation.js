// validations/settings.validation.js
const Joi = require("joi");
const seoValidationSchema = require("../../constants/seo-validation-schema")

const objectId = Joi.string().hex().length(24);
const iranMobileRegex = /^09\d{9}$/;
const iranPhoneRegex = /^0\d{10}$/; // Example: 021xxxxxxx or 0x...

const ContactInfoSchema = Joi.object({
  mobile: Joi.string()
        .trim()
        .pattern(iranMobileRegex)
        .messages({
          "string.pattern.base": "Mobile number must be a valid Iranian mobile (e.g. 09123456789)",
        })
    .default(""),

  phone: Joi.string()
        .trim()
        .pattern(iranPhoneRegex)
        .messages({
          "string.pattern.base": "Phone must be a valid Iranian phone number (e.g. 02112345678)",
        })
    .default(""),

  email: Joi.string().trim().email().default(""),

  address: Joi.string().trim(),
  mapIframe: Joi.string().trim(),
});

const SocialSchema = Joi.object({
  instagram: Joi.string().uri().trim(),
  telegram: Joi.string().uri().trim(),
  whatsapp: Joi.string().uri().trim(),
  facebook: Joi.string().uri().trim(),
  youtube: Joi.string().uri().trim(),
  linkedin: Joi.string().uri().trim(),
  x: Joi.string().uri().trim(),
});

const FAQSchema = Joi.object({
  question: Joi.string().trim().required(),
  answer: Joi.string().trim().required(),
});

const TermsSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
});

const AboutSchema = Joi.object({
  image: objectId,
  description: Joi.string().trim(),
});

const settingsValidation = {
  create: Joi.object({
    [`default-seo`]: seoValidationSchema,

    general: Joi.object({
  name: Joi.string(),
      logo: objectId,
      footerText: Joi.string().trim(),
      contactInfo: ContactInfoSchema,
      social: SocialSchema,
      homepageSlider: Joi.array().items(objectId).default([]),
    }),

    faq: Joi.array().items(FAQSchema).default([]),

    terms: Joi.array().items(TermsSchema).default([]),

    about: AboutSchema,
  }),

  update: Joi.object({
    [`default-seo`]: seoValidationSchema,
    general: Joi.object({
  name: Joi.string(),
      logo: objectId,
      footerText: Joi.string().trim(),
      contactInfo: ContactInfoSchema,
      social: SocialSchema,
      homepageSlider: Joi.array().items(objectId),
    }),
    faq: Joi.array().items(FAQSchema),
    terms: Joi.array().items(TermsSchema),
    about: AboutSchema,
  }).min(1), // must update at least one field
};

module.exports = settingsValidation;
