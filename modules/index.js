const express = require("express");
const router = express.Router();

const mediaRoutes = require("./media/media.routes");
const brandRoutes = require("./brand/brand.routes");
const categoryRoutes = require("./category/category.routes");
const tagRoutes = require("./tag/tag.routes");
const productRoutes = require("./product/product.routes");
const cartRoutes = require("./cart/cart.routes");
const orderRoutes = require("./order/order.routes");
const customerRoutes = require("./customer/customer.routes");
const adminRoutes = require("./admin/admin.routes");
const addressRoutes = require("./address/address.routes");
const settingsRoutes = require("./settings/settings.routes");
const contactRoutes = require("./contact/contact.routes");
const transactionRoutes = require("./transaction/transaction.routes");
const dashboardRoutes = require("./dashboard/dashboard.routes");

router.use("/media", mediaRoutes);
router.use("/brand", brandRoutes);
router.use("/category", categoryRoutes);
router.use("/tag", tagRoutes);
router.use("/product", productRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);
router.use("/customer", customerRoutes);
router.use("/admin", adminRoutes);
router.use("/address", addressRoutes);
router.use("/settings", settingsRoutes);
router.use("/contact", contactRoutes);
router.use("/transaction", transactionRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
