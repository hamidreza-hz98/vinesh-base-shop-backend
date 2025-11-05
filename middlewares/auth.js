// // middlewares/auth.js
// const { verifyToken } = require("../lib/token");
// const Admin = require("../models/Admin");
// const User = require("../models/User");

// // Base authentication
// exports.authenticate = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader?.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Missing or invalid token" });
//   }

//   const token = authHeader.split(" ")[1];
//   const decoded = verifyToken(token);
//   if (!decoded) return res.status(401).json({ message: "Invalid token" });

//   // Detect token type
//   if (decoded.type === "admin") {
//     const admin = await Admin.findById(decoded.id);
//     if (!admin) return res.status(401).json({ message: "Admin not found" });
//     req.admin = admin;
//   } else if (decoded.type === "user") {
//     const user = await User.findById(decoded.id);
//     if (!user) return res.status(401).json({ message: "User not found" });
//     req.user = user;
//   } else {
//     return res.status(401).json({ message: "Unknown token type" });
//   }

//   next();
// };

// // Role-based admin authorization
// exports.allowRoles = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (!req.admin)
//       return res.status(403).json({ message: "Admin access required" });

//     const hierarchy = ["viewer", "admin", "superadmin"];
//     const adminRole = req.admin.role;

//     // Superadmin always allowed
//     if (adminRole === "superadmin") return next();

//     const userIndex = hierarchy.indexOf(adminRole);
//     const minAllowedIndex = Math.min(
//       ...allowedRoles.map((r) => hierarchy.indexOf(r))
//     );

//     if (userIndex < minAllowedIndex) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     next();
//   };
// };

// // User-only routes
// exports.requireUser = (req, res, next) => {
//   if (!req.user)
//     return res.status(403).json({ message: "User access required" });
//   next();
// };

// // ✅ NEW: routes that both user or admin can access
// exports.allowUserOrAdmin = (req, res, next) => {
//   if (req.user || req.admin) {
//     return next();
//   }
//   return res.status(403).json({ message: "User or Admin access required" });
// };
