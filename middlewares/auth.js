// middlewares/auth.js
const { verifyToken } = require("../lib/token");
const Admin = require("../models/Admin");
const Customer = require("../models/Customer");

// Base authentication
exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "توکن نامعتبر" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: "توکن نامعتبر" });

  // Identify token owner
  if (decoded.type === "admin") {
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ message: "مدیر پیدا نشد" });
    req.admin = admin;
  } else if (decoded.type === "customer") {
    const customer = await Customer.findById(decoded.id);
    if (!customer) return res.status(401).json({ message: "مشتری پیدا نشد" });
    req.customer = customer;
  } else {
    return res.status(401).json({ message: "نوع توکن ناشناخته" });
  }

  next();
};

// Admin-only routes
exports.requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded.type === "admin")
    return res.status(403).json({ message: "دسترسی مدیر مورد نیاز است" });
  next();
};

// Customer-only routes
exports.requireCustomer = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  
  if (!decoded.type === "customer")
    return res.status(403).json({ message: "دسترسی مشتری مورد نیاز است" });
  next();
};

// Routes accessible by both admin or customer
exports.allowCustomerOrAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (decoded.type === "admin" || decoded.type === "customer") return next();
  return res
    .status(403)
    .json({ message: "دسترسی مشتری یا مدیر مورد نیاز است" });
};
