const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate");
const categoryValidation = require("./category.validation");

const categoryController = require("./category.controller");

const { authenticate, requireAdmin } = require("../../middlewares/auth");

router.post(
  "/",
  authenticate,
  requireAdmin,
  validate(categoryValidation.create),
  categoryController.create
);


router.get("/", categoryController.getAll);

router.get("/details", categoryController.getDetails);

router.put(
  "/:_id",
  authenticate,
  requireAdmin,
  validate(categoryValidation.update),
  categoryController.update
);

router.delete("/:_id", authenticate, requireAdmin, categoryController.delete);

module.exports = router;
