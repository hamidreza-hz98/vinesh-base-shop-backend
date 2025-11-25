const orderService = require("./order.service");

const orderController = {
  async create(req, res) {
    const data = req.body;


    try {
      const order = await orderService.create(data);

      res.success({
        message: `سفارش ${order.code} با موفقیت ثبت شد.`,
        data: order,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در ایجاد سفارش پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async update(req, res) {
    const data = req.body;
    const { _id } = req.params;

    try {
      const order = await orderService.update(data, _id);

      res.success({
        message: `سفارش ${order.code} با موفقیت ویرایش شد.`,
        data: order,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در ویرایش سفارش پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getAll(req, res) {
    const query = req.query;

    try {
      const { orders, total } = await orderService.getAll(query);

      res.success({
        data: {
          orders,
          ...query,
          total,
        },
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در گرفتن لیست سفارش ها پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getDetails(req, res) {
    const _id = req.params._id;

    try {
      const order = await orderService.getDetails(_id);

      res.success({
        data: order,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در گرفتن اطلاعات سفارش  پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getCustomerOrdes(req, res) {
    const { customerId } = req.params;
    const query = req.query;
    try {
      const { orders, total } = await orderService.getCustomerOrders(
        customerId,
        query
      );

      res.success({
        data: {
          orders,
          ...query,
          total,
          customerId,
        },
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در گرفتن لیست سفارش ها پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getCustomerOrderDetails(req, res) {
    const code = req.params.code;
    const { customerId } = req.query;

    try {
      const order = await orderService.getCustomerOrderDetails(
        code,
        customerId
      );

      res.success({
        data: order,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در گرفتن اطلاعات سفارش  پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },
};

module.exports = orderController;
