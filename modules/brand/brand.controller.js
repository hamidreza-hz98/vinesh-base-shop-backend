const brandService = require("./brand.service");

const brandController = {
  async create(req, res) {
    const data = req.body;

    try {
      const brand = await brandService.create(data);

      res.success({
        message: `برند ${brand.name} با موفقیت ایجاد شد.`,
        data: brand,
      });
    } catch (error) {
      res.error({
        message: error.message || "خطایی در ایجاد برند رخ داد.",
        code: error.statusCode || 500,
      });
    }
  },

  async update(req, res) {
    const data = req.body;
    const _id = req.params._id;

    try {
      const brand = await brandService.update(data, _id);

      res.success({
        message: `برند ${brand.name} با موفقیت به‌روزرسانی شد.`,
        data: brand,
      });
    } catch (error) {
      res.error({
        message: error.message || "خطایی در به‌روزرسانی برند رخ داد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getAll(req, res) {
    const query = req.query;

    try {
      const { brands, total } = await brandService.getAll(query);

      res.success({
        data: {
          brands,
          total,
        },
      });
    } catch (error) {
      res.error({
        message: error.message || "خطایی در دریافت لیست برندها رخ داد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getDetails(req, res) {
    const filter = req.query;

    try {
      const brand = await brandService.getDetails(filter);

      res.success({
        data: brand,
      });
    } catch (error) {
      res.error({
        message: error.message || "خطایی در دریافت جزئیات برند رخ داد.",
        code: error.statusCode || 500,
      });
    }
  },

  async delete(req, res) {
    const _id = req.params._id;

    try {
      const brand = await brandService.delete(_id);

      res.success({
        message: `برند ${brand.name} با موفقیت حذف شد.`,
        data: brand,
      });
    } catch (error) {
      res.error({
        message: error.message || "خطایی در حذف برند رخ داد.",
        code: error.statusCode || 500,
      });
    }
  },
};

module.exports = brandController;
