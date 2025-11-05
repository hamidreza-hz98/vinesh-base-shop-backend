const express = require("express");
const router = express.Router();

const brandController = require("./brand.controller");
const validate = require("../../middlewares/validate");
const brandValidation = require("./brand.validation");

const {
  authenticate,
  requireAdmin,
} = require("../../middlewares/auth");

router.post(
  "/",
  authenticate,
  requireAdmin,
  validate(brandValidation.create),
  brandController.create
);

router.get("/", brandController.getAll);

router.get("/details", brandController.getDetails);

router.put(
  "/:_id",
  authenticate,
  requireAdmin,
  validate(brandValidation.update),
  brandController.update
);

router.delete("/:_id", 
  authenticate,
   requireAdmin,
    brandController.delete);

module.exports = router;
