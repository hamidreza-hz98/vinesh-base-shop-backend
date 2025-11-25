const cartService = require("./cart.service");

const cartController = {
  async create(req, res) {
    const body = req.body;

    try {
      const cart = await cartService.create(body);

      res.success({
        data: cart,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در ساختن سبد خرید پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async update(req, res) {
    const _id = req.params._id;
    const data = req.body;

    try {
      const cart = await cartService.update(_id, data);

      res.success({
        data: cart,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در به روز رسانی سبد خرید پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getCustomerCart(req, res) {
    const customerId = req.params.customerId;

    try {
      const cart = await cartService.getCustomerCart(customerId);

      res.success({
        data: cart,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در گرفتن اطلاعات سبد خرید پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getCart(req, res) {
    const _id = req.params._id;

    try {
      const cart = await cartService.getCart(_id);

      res.success({
        data: cart,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در گرفتن اطلاعات سبد خرید پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },
};

module.exports = cartController;
