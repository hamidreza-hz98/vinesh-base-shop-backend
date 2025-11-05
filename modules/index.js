const express = require("express");
const router = express.Router();

const mediaRoutes = require("./media/media.routes");
const brandRoutes = require("./brand/brand.routes");
const categoryRoutes = require("./category/category.routes");
const tagRoutes = require("./tag/tag.routes");
const productRoutes = require("./product/product.routes");

router.use("/media", mediaRoutes);
router.use("/brand", brandRoutes);
router.use("/category", categoryRoutes);
router.use("/tag", tagRoutes);
router.use("/product", productRoutes);

module.exports = router;
