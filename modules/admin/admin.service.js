const Admin = require("../../models/Admin");
const throwError = require("../../middlewares/throw-error");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../lib/token");

const adminService = {
  async create(data) {
    const existing = await Admin.exists({ username: data.username });
    if (existing) {
      throwError("کاربر با این شناسه کاربری وجود دارد.", 409);
    }

    const admin = new Admin(data);

    return await admin.save();
  },

  async login(data) {
    
    const existing = await Admin.findOne({ username: data.username });
    if (!existing) {
      throwError("نام کاربری یا کلمه ی عبور اشتباه است.", 401);
    }
    
    
    const isMatch = await bcrypt.compare(data.password, existing.password);
    if (!isMatch) {
      throwError("نام کاربری یا کلمه ی عبور اشتباه است.", 401);
    }
    
    const token = generateToken({
      id: existing._id,
      type: "admin",
    });

    const { password: _, ...adminData } = existing.toObject();

    return { admin: adminData, token };
  },
};

module.exports = adminService;
