const express = require("express");
const router = express.Router();
const PaymentController = require("./transaction.controller");

router.post("/initiate", PaymentController.initiate);
router.post("/retry", PaymentController.retryPayment);
router.get("/verify", PaymentController.verify);

module.exports = router;
