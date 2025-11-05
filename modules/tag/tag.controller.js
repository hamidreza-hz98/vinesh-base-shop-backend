const tagService = require("./tag.service");

const tagController = {
  async create(req, res) {
    const data = req.body;

    try {
      const tag = await tagService.create(data);

      res.success({
        message: `برچسب ${tag.name} با موفقیت ایجاد شد.`,
        data: tag,
      });
    } catch (error) {
      res.error({
        message: error.message || "خطا در ایجاد برچسب.",
        status: error.statusCode || 500,
      });
    }
  },

  async update(req, res) {
    const data = req.body;
    const { _id } = req.params;

    try {
      const tag = await tagService.update(data, _id);

      res.success({
        message: `برچسب ${tag.name} با موفقیت ویرایش شد.`,
        data: tag,
      });
    } catch (error) {
      res.error({
        message: error.message || "خطا در ویرایش برچسب.",
        status: error.statusCode || 500,
      });
    }
  },

  async getAll(req, res) {
    const query = req.query;

    try {
      const { tags, total } = await tagService.getAll(query);
      res.success({
        message: "برچسب ها با موفقیت دریافت شدند.",
        data: {
          tags,
          ...query,
          total,
        },
      });
    } catch (error) {
      res.error({
        message: error.message || "خطا در دریافت برچسب ها.",
        status: error.statusCode || 500,
      });
    }
  },

  async getDetails(req, res) {
    const filter = req.query;

    try {
      const tag = await tagService.getDetails(filter);

      res.success({
        data: tag,
      });
    } catch (error) {
      res.error({
        message: error.message || "خطا در دریافت جزئیات برچسب.",
        status: error.statusCode || 500,
      });
    }
  },

  async delete(req, res) {
    const { _id } = req.params;

    try {
      const tag = await tagService.delete(_id);

      res.success({
        message: `برچسب ${tag.name} با موفقیت حذف شد.`,
        data: tag,
      });
    } catch (error) {
      res.error({
        message: error.message || "خطا در حذف برچسب.",
        status: error.statusCode || 500,
      });
    }
  },
};

module.exports = tagController;
