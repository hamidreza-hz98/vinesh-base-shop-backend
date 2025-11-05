const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate");
const tagValidation = require("./tag.validation");

const tagController = require("./tag.controller");
const { authenticate, requireAdmin } = require("../../middlewares/auth");

router.post(
  "/",
  authenticate,
  requireAdmin,
  validate(tagValidation.create),
  tagController.create
);

router.get("/", tagController.getAll);

router.get("/details", tagController.getDetails);

router.put(
  "/:_id",
  authenticate,
  requireAdmin,
  validate(tagValidation.update),
  tagController.update
);

router.delete("/:_id", authenticate, requireAdmin, tagController.delete);

module.exports = router;
