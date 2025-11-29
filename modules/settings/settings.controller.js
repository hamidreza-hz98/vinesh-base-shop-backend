const settingsService = require("./settings.service");

const settingsController = {
  async update(req, res) {
    const data = req.body;
    const { section } = req.params;

    try {
      const settings = await settingsService.update(data, section);

      res.success({
        message: "تنظیمات سایت با موفقیت ویرایش شد.",
        data: settings,
      });
    } catch (error) {
      res.error({
        message:
          error.message || "مشکلی در بروز رسانی تنظیمات سایت به وجود آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getSettings(req, res) {
    const { section } = req.params;

    try {
      const settings = await settingsService.getSection(section);

      res.success({
        data: settings,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در گرفتن تنظیمات سایت پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getAllSettings(req, res) {
    try {
      const settings = await settingsService.getSettings();

      res.success({
        data: settings,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در گرفتن تنظیمات سایت پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getDefaultSeo(req, res){
    try {
      const defaultSeo = await settingsService.getDefaultSeo()
      res.success({
        data: defaultSeo
      })
    } catch (error) {
      res.error({
        message: error.message || "مشکلی پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getFaqSchema(req, res) {
    try {
      const schema = await settingsService.getFaqSchema();

      res.success({
        data: schema,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getTermsSchema(req, res) {
    try {
      const schema = await settingsService.getTermsSchema();

      res.success({
        data: schema,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },
};

module.exports = settingsController;
