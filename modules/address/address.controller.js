const addressService = require("./address.service");

const addressController = {
  async create(req, res) {
    const data = req.body;

    try {
      const address = await addressService.create(data);

      res.success({
        message: "آدرس جدید با موفقیت ساخته شد.",
        data: address,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در ساختن آدرس جدید پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async update(req, res) {
    const data = req.body;
    const { _id } = req.params;

    try {
      const address = await addressService.update(data, _id);

      res.success({
        message: "آدرس با موفقیت ویرایش شد.",
        data: address,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در ویرایش آدرس پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async getCustomerAddresses(req, res) {
    const { customerId } = req.params;

    try {
      const addresses = await addressService.getCustomerAddresses(customerId);

      res.success({
        data: addresses,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در گرفتن لیست آدرس ها به وجود آمد.",
        code: error.statusCode || 500,
      });
    }
  },

  async delete(req, res) {
    const { _id } = req.params;

    try {
      const address = await addressService.delete(_id);

      res.success({
        message: "آدرس با موفقیت حذف شد.",
        data: address,
      });
    } catch (error) {
      res.error({
        message: error.message || "مشکلی در حذف آدرس پیش آمد.",
        code: error.statusCode || 500,
      });
    }
  },
};

module.exports = addressController;
