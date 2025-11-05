const Address = require("../../models/Address");
const throwError = require("../../middlewares/throw-error");

const addressService = {
  async create(data) {
    const existing = await Address.exists({ zipCode: data.zipCode });

    if (existing) {
      throwError("آدرس با این کد پستی وجود دارد.", 409);
    }

    const address = new Address(data);

    return await address.save();
  },

  async update(data, _id) {
    const existing = await Address.exists({ _id });
    if (!existing) {
      throwError("آدرسی با این مشخصات وجود ندارد.", 404);
    }

    const updated = await Address.findByIdAndUpdate(_id, data, { new: true });

    return updated;
  },

  async getCustomerAddresses(customerId) {
    const addresses = await Address.find({ customer: customerId });

    return addresses;
  },

  async delete(_id) {
    const existing = await Address.exists({ _id });
    if (!existing) {
      throwError("آدرسی با این مشخصات وجود ندارد.", 404);
    }

    const deleted = await Address.findByIdAndDelete(_id);

    return deleted;
  },
};

module.exports = addressService;
