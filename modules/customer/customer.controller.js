const customerService = require("./customer.service");

const customerController = {
  async create(req, res) {
    const data = req.body;

    try {
      const customer = await customerService.create(data);

      res.success({
        message: `کاربر ${customer.firstName + " " + customer.lastName} با موفقیت ساخته شد.`,
        data: customer,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در ساختن کاربر جدید پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async update(req, res) {
    const data = req.body;
    const { _id } = req.params;

    try {
      const customer = await customerService.update(data, _id);

      res.success({
        message: `کاربر ${customer.firstName + " " + customer.lastName} با موفقیت ویرایش شد.`,
        data: customer,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در ویرایش کاربر پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getAll(req, res) {
    const query = req.query;

    try {
      const { customers, total } = await customerService.getAll(query);

      res.success({
        data: {
          customers,
          total,
          ...query,
        },
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در گرفتن لیست کاربران پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getDetails(req, res) {
    const { _id } = req.params;

    try {
      const customer = await customerService.getDetails(_id);

      res.success({
        data: customer,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در گرفتن اطلاعات کاربر پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async delete(req, res) {
    const { _id } = req.params;

    try {
      const customer = await customerService.delete(_id);

      res.success({
        message: `کاربر ${customer.firstName + " " + customer.lastName} با موفقیت حذف شد.`,
        data: customer,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در حذف کاربر پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async signup(req, res) {
    const data = req.body;

    try {
      const { customer, token } = await customerService.signup(data);

      res.success({
        message: `به خانواده ما خوش اومدی!`,
        data: {
          customer,
          token,
        },
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async login(req, res) {
    const data = req.body;

    try {
      const { customer, token } = await customerService.login(data);

      res.success({
        message: ` ${customer.firstName} عزیز، خوش آمدی!`,
        data: {
          customer,
          token,
        },
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },
};

module.exports = customerController;
