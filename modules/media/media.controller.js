const { mediaService } = require("./media.service");

const mediaController = {
  async upload(req, res) {
    const { file, body } = req;
    try {
      const media = await mediaService.upload({ file, body });

      res.success({
        message: `مدیا با موفقیت بارگزاری شد.`,
        data: media,
      });
    } catch (error) {
      res.error({ message: error.message, code: error.statusCode });
    }
  },

  async update(req, res) {
    const _id = req.params.id
    const {file, body} = req;

    try {
      const media = await mediaService.update(_id, {file, body});

      res.success({
        message: `مدیا با موفقیت به روز رسانی شد.`,
        data: media,
      });
    } catch (error) {
      res.error({ message: error.message, code: error.statusCode });
    }
  },

  async getDetails(req, res) {
    try {
      const media = await mediaService.getDetails(req.query);

      res.success({ data: media });
    } catch (error) {
      res.error({ message: error.message, code: error.statusCode });
    }
  },

  async getAll(req, res) {
    const query = req.query;

    try {
      const { items, total } = await mediaService.getAll(query);

      res.success({
        data: { items, total, ...query },
      });
    } catch (error) {
      res.error({ message: error.message, code: error.statusCode });
    }
  },

  async delete(req, res) {
    try {
      const media = await mediaService.delete(req.params.id);

      res.success({
        message: `مدیا ${media.originalName} با موفقیت حذف شد.`,
      });
    } catch (error) {
      res.error({ message: error.message, code: error.statusCode });
    }
  },
};

module.exports = { mediaController };
