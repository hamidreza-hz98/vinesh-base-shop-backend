// validations/cart.validation.js
const Joi = require("joi");
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const cartProductSchema = Joi.object({
  product: Joi.string().pattern(objectIdRegex).required(),
  quantity: Joi.number().min(1).required().default(1),
});

const priceSchema = Joi.object({
  products: Joi.number().min(0).default(0),
  shipment: Joi.number().min(0).default(0),
  discounts: Joi.number().min(0).default(0),
}).default({});

const cartValidation = {
  create: Joi.object({
    products: Joi.array().items(cartProductSchema).min(1).required(),
    customer: Joi.string().pattern(objectIdRegex).required(),
    description: Joi.string().allow("", null),
    address: Joi.string().pattern(objectIdRegex).allow(null),
    payment: Joi.object().default({}),
    price: priceSchema,
  }),

  update: Joi.object({
    products: Joi.array().items(cartProductSchema),
    customer: Joi.string().pattern(objectIdRegex),
    description: Joi.string().allow("", null),
    address: Joi.string().pattern(objectIdRegex).allow(null),
    payment: Joi.object(),
    price: priceSchema,
  }).min(1), // At least one field required on update
};

module.exports = cartValidation;
