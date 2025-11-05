const adminService = require("./admin.service");

const adminController = {
  async create(req, res) {
    const data = req.body;

    try {
      const admin = await adminService.create(data);

      res.success({
        message: `ادمین ${admin.username} ساخته شد.`,
        data: admin,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در ساخت ادمین جدید پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async login(req, res) {
    const data = req.body;

    try {
      const { admin, token } = await adminService.login(data);

      res.success({
        message: `${admin.username} عزیز، خوش آمدید.`,
        data: { admin, token },
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },
};

module.exports = adminController;
