const categoryService = require("./category.service");

const categoryController = {
  async create(req, res) {
    const data = req.body;

    try {
      const category = await categoryService.create(data);

      res.success({
        message: `دسته بندی ${category.name} با موفقیت ایجاد شد.`,
        data: category,
      });
    } catch (error) {
      res.error({
        message: error.message || "خطایی در ایجاد دسته بندی رخ داد.",
        code: error.statusCode || 500,
      });
    }
  },

  async update(req, res) {
    const data = req.body;
    const { _id } = req.params;

    try {
      const category = await categoryService.update(data, _id);

      res.success({
        message: `دسته بندی ${category.name} با موفقیت ویرایش شد.`,
        data: category,
      });
    } catch (error) {
      res.error({
        message: error.message || "خطایی در ویرایش دسته بندی رخ داد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getAll(req, res) {
    const query = req.query;

    try {
      const { categories, total } = await categoryService.getAll(query);

      res.success({
        data: {
          categories,
          ...query,
          total,
        },
      });
    } catch (error) {
      res.error({
        message: error.message || "خطایی در دریافت دسته بندی ها رخ داد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getDetails(req, res) {
    const filter = req.query;

    try {
      const category = await categoryService.getDetails(filter);

      res.success({
        data: category,
      });
    } catch (error) {
      res.error({
        message: error.message || "خطایی در دریافت جزئیات دسته بندی رخ داد.",
        code: error.statusCode || 500,
      });
    }
  },

  async delete(req, res) {
    const { _id } = req.params;

    try {
      const category = await categoryService.delete(_id);
      res.success({
        message: `دسته بندی ${category.name} با موفقیت حذف شد.`,
      });
    } catch (error) {
      res.error({
        message: error.message || "خطایی در حذف دسته بندی رخ داد.",
        code: error.statusCode || 500,
      });
    }
  },
};

module.exports = categoryController;
