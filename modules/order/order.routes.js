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

router.get("/:_id", authenticate, requireAdmin, orderController.getDetails)

router.put(
  "/:_id",
  authenticate,
  requireAdmin,
  validate(orderValidation.update),
  orderController.update
);

router.get(
  "/customer/:customerId",
  authenticate,
  requireCustomer,
  orderController.getCustomerOrdes
);

router.get(
  "/details/customer/:code",
  authenticate,
  requireCustomer,
  orderController.getCustomerOrderDetails
);

module.exports = router;
