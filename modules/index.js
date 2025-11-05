const express = require("express");
const router = express.Router();

const mediaRoutes = require("./media/media.routes");
const brandRoutes = require("./brand/brand.routes");
const categoryRoutes = require("./category/category.routes");

router.use("/media", mediaRoutes);
router.use("/brand", brandRoutes);
router.use("/category", categoryRoutes);

module.exports = router;
