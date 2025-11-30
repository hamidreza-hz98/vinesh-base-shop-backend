const express = require("express")
const router = express.Router()

const dashboardController = require("./dashboard.controller")
const { authenticate, requireAdmin } = require("../../middlewares/auth")

router.get("/", authenticate, requireAdmin, dashboardController.getData)

module.exports = router