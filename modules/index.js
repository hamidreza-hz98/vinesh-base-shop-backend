const express = require("express");
const router = express.Router();

const mediaRoutes = require("./media/media.routes");
const brandRoutes = require("./brand/brand.routes");

router.use("/media", mediaRoutes);
router.use("/brand", brandRoutes);

module.exports = router;
