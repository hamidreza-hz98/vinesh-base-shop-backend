const express = require("express");
const router = express.Router();

const validate = require("../../middlewares/validate");
const productValidation = require("./product.validation");

const productController = require("./product.controller");
const { authenticate, requireAdmin } = require("../../middlewares/auth");

router.post(
  "/",
  authenticate,
  requireAdmin,
  validate(productValidation.create),
  productController.create
);

router.get("/", productController.getAll);

router.get("/details", productController.getDetails);

router.get("/seo", productController.getSeoData)

router.get("/sitemap", productController.getProductsForSitemap)

router.put(
  "/:_id",
  authenticate,
  requireAdmin,
  validate(productValidation.update),
  productController.update
);

router.delete(
  "/:_id",
  authenticate,
  requireAdmin,
  productController.delete
);

module.exports = router;
