const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate");
const cartValidation = require("./cart.validation");

const cartController = require("./cart.controller");
const { authenticate, requireCustomer } = require("../../middlewares/auth");

router.post(
  "/",
  cartController.create
);

router.post(
  "/update/:_id",
  cartController.update
);

router.get(
  "/details/:_id",
  cartController.getCart
);

router.get(
  "/:customerId",
  authenticate,
  requireCustomer,
  cartController.getCustomerCart
);

module.exports = router;
