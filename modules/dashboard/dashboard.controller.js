const dashboardService = require("./dashboard.service");

const dashboardController = {
  async getData(req, res) {
    const { status } = req.query;

    try {
      const dashboard = await dashboardService.getDashboardData(status);

      res.success({
        data: dashboard,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی پیش آمد",
        code: error.statusCode || 500,
      });
    }
  },
};

module.exports = dashboardController;
