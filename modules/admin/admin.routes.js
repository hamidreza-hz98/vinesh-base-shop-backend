const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate");
const adminValidation = require("./admin.validation");

const { requireAdmin, authenticate } = require("../../middlewares/auth");
const adminController = require("./admin.controller");

router.post(
  "/",
  authenticate,
  requireAdmin,
  validate(adminValidation.create),
  adminController.create
);

router.post("/login", validate(adminValidation.login), adminController.login);

module.exports = router;
