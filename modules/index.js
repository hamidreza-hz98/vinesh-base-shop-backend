const express = require("express");
const router = express.Router();

const mediaRoutes = require("./media/media.routes");
const brandRoutes = require("./brand/brand.routes");
const categoryRoutes = require("./category/category.routes");
const tagRoutes = require("./tag/tag.routes");
const productRoutes = require("./product/product.routes");
const cartRoutes = require("./cart/cart.routes");
const orderRoutes = require("./order/order.routes");

router.use("/media", mediaRoutes);
router.use("/brand", brandRoutes);
router.use("/category", categoryRoutes);
router.use("/tag", tagRoutes);
router.use("/product", productRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);

module.exports = router;
