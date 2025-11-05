const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate");
const settingsValidation = require("./settings.validation");

const settingsController = require("./settings.controller");
const { authenticate, requireAdmin } = require("../../middlewares/auth");

router.post(
  "/",
  authenticate,
  requireAdmin,
  validate(settingsValidation.update),
  settingsController.update
);

router.get("/:section", settingsController.getSettings);

module.exports = router;
