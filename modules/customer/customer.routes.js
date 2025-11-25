const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate");
const customerValidation = require("./customer.validation");

const customerController = require("./customer.controller");
const {
  authenticate,
  requireAdmin,
  requireCustomer,
  allowCustomerOrAdmin,
} = require("../../middlewares/auth");

router.post(
  "/",
  authenticate,
  requireAdmin,
  validate(customerValidation.create),
  customerController.create
);

router.get("/", authenticate, requireAdmin, customerController.getAll);

router.post(
  "/signup",
  validate(customerValidation.create),
  customerController.signup
);

router.post(
  "/login",
  validate(customerValidation.login),
  customerController.login
);

router.get(
  "/:_id",
  authenticate,
  authenticate,
  allowCustomerOrAdmin,
  customerController.getDetails
);

router.put(
  "/:_id",
  authenticate,
  allowCustomerOrAdmin,
  validate(customerValidation.update),
  customerController.update
);

router.delete("/:_id", authenticate, requireAdmin, customerController.delete);

module.exports = router;
