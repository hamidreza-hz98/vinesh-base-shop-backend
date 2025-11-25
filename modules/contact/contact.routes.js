const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate");
const contactValidation = require("./contact.validation");

const contactController = require("./contact.controller");
const { authenticate, requireAdmin } = require("../../middlewares/auth");

router.post("/", validate(contactValidation.submit), contactController.submit);

router.get("/", authenticate, requireAdmin, contactController.getAll);

module.exports = router;
