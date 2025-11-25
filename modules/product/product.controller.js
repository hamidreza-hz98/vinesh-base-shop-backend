const productService = require("./product.service");

const productController = {
  async create(req, res) {
    const data = req.body;

    try {
      const product = await productService.create(data);

      res.success({
        message: `محصول ${product.title} با موفقیت ایجاد شد.`,
        data: product,
      });
    } catch (error) {
      res.error({
        message: error.message || "خطایی در ایجاد محصول رخ داد.",
        code: error.statusCode || 500,
      });
    }
  },

  async update(req, res) {
    const data = req.body;
    const { _id } = req.params;

    try {
      const product = await productService.update(data, _id);

      res.success({
        message: `محصول ${product.title} با موفقیت به‌روزرسانی شد.`,
        data: product,
      });
    } catch (error) {
      res.error({
        message: error.message || "خطایی در به‌روزرسانی محصول رخ داد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getAll(req, res) {
    const query = req.query;

    try {
      const { products, total } = await productService.getAll(query);

      res.success({
        data: {
          products,
          ...query,
          total,
        },
      });
    } catch (error) {
      res.error({
        message: error.message || "خطایی در دریافت محصولات رخ داد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getDetails(req, res) {
    const filter = req.query;

    try {
      const product = await productService.getDetails(filter);

      res.success({
        data: product,
      });
    } catch (error) {
      res.error({
        message: error.message || "خطایی در دریافت جزئیات محصول رخ داد.",
        code: error.statusCode || 500,
      });
    }
  },

  async delete(req, res) {
    const { _id } = req.params;

    try {
      const product = await productService.delete(_id);

      res.success({
        message: `محصول ${product.title} با موفقیت حذف شد.`,
        data: product,
      });
    } catch (error) {
      res.error({
        message: error.message || "خطایی در حذف محصول رخ داد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getSeoData(req, res) {
    const filter = req.query;

    try {
      const seo = await productService.getSeoData(filter);

      res.success({
        data: seo,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getProductsForSitemap(req, res) {
    try {
      const products = await productService.getProductsForSitemap();

      res.success({
        data: products,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },
};

module.exports = productController;
