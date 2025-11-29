const express = require("express");
const router = express.Router();
const PaymentController = require("./transaction.controller");

router.post("/initiate", PaymentController.initiate);
router.get("/verify", PaymentController.verify); // this is callback_url that Zarinpal redirects to

module.exports = router;
