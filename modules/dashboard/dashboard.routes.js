const express = require("express")
const router = express.Router()

const dashboardController = require("./dashboard.controller")
const { authenticate, requireAdmin } = require("../../middlewares/auth")

router.get("/", dashboardController.getData)

module.exports = router