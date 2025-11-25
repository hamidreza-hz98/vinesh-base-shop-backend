const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate");
const addressValidation = require("./address.validation");

const addressController = require("./address.controller");
const { authenticate, requireCustomer } = require("../../middlewares/auth");

router.post(
  "/",
  authenticate,
  requireCustomer,
  validate(addressValidation.create),
  addressController.create
);

router.put(
  "/:_id",
  authenticate,
  requireCustomer,
  validate(addressValidation.update),
  addressController.update
);

router.get(
  "/:customerId",
  authenticate,
  requireCustomer,
  addressController.getCustomerAddresses
);

router.delete("/:_id", authenticate, requireCustomer, addressController.delete);

module.exports = router;
