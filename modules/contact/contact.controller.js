const contactService = require("./contact.service");

const contactController = {
  async submit(req, res) {
    const data = req.body;

    try {
      const { fullName } = await contactService.submit(data);

      res.success({
        message: `${fullName} عزیز. به زودی با شما تماس میگیریم!`,
      });
    } catch (error) {
      res.error({
        message: "مشکلی پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getAll(req, res) {
    const query = req.query;

    try {
      const { contacts, total } = await contactService.getAll(query);

      res.success({
        data: {
          contacts,
          total,
          ...query,
        },
      });
    } catch (error) {
      res.error({
        message: "مشکلی پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },
};

module.exports = contactController;
