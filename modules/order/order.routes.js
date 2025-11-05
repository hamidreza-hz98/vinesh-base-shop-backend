const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate");
const orderValidation = require("./order.validation");

const orderController = require("./order.controller");
const {
  authenticate,
  requireAdmin,
  requireCustomer,
} = require("../../middlewares/auth");

router.post(
  "/",
  authenticate,
  requireCustomer,
  validate(orderValidation.create),
  orderController.create
);

router.get("/", authenticate, requireAdmin, orderController.getAll);

router.put(
  "/:_id",
  authenticate,
  requireAdmin,
  validate(orderValidation.update),
  orderController.update
);

router.get(
  "/:customerId",
  authenticate,
  requireCustomer,
  orderController.getCustomerOrdes
);

module.exports = router;
