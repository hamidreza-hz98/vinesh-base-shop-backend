// validations/order.validation.js
const Joi = require("joi");
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const orderProductSchema = Joi.object({
  product: Joi.string().pattern(objectIdRegex).required(),
  quantity: Joi.number().min(1).required().default(1),
});

const priceSchema = Joi.object({
  products: Joi.number().min(0).default(0),
  shipment: Joi.number().min(0).default(0),
  discounts: Joi.number().min(0).default(0),
}).default({});

const orderValidation = {
  create: Joi.object({
    status: Joi.string()
      .valid("pending_payment", "paid", "shipping", "delivered")
      .default("pending_payment"),
    products: Joi.array().items(orderProductSchema).min(1).required(),
    customer: Joi.string().pattern(objectIdRegex).required(),
    description: Joi.string().allow("", null),
    address: Joi.object().required(),
    transaction: Joi.string().pattern(objectIdRegex).allow(null),
    price: priceSchema,
    shipmentDate: Joi.date().allow(null),
    shipmentTrackNumber: Joi.string().allow("", null),
  }),

  update: Joi.object({
    status: Joi.string().valid("pending_payment", "paid", "shipping", "delivered"),
    products: Joi.array().items(orderProductSchema),
    customer: Joi.string().pattern(objectIdRegex),
    description: Joi.string().allow("", null),
    address: Joi.object(),
    transaction: Joi.string().pattern(objectIdRegex),
    price: priceSchema,
    shipmentDate: Joi.date().allow(null),
    shipmentTrackNumber: Joi.string().allow("", null),
  }).min(1), // At least one field must be updated
};

module.exports = orderValidation;
