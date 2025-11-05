const cartService = require("./cart.service");

const cartController = {
  async update(req, res) {
    const customerId = req.params.customerId;
    const data = req.body;

    try {
      const cart = await cartService.update(customerId, data);

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
  
  async getCustomerCart(req, res){
    const customerId = req.params.customerId

    try {
      const cart = await cartService.getCustomerCart(customerId)

      res.success({
        data: cart
      })
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در گرفتن اطلاعات سبد خرید پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  }
};

module.exports = cartController;
