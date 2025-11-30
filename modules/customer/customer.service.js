const Customer = require("../../models/Customer");
const throwError = require("../../middlewares/throw-error");
const { buildMongoFindQuery, buildMongoSort } = require("../../lib/filter");
const { generateToken } = require("../../lib/token");
const bcrypt = require("bcrypt");

const customerService = {
  async create(data) {
    const existing = await Customer.exists({ phone: data.phone });

    if (existing) {
      throwError("مشتری با این شماره تلفن قبلا ثبت نام کرده است.", 409);
    }

    const customer = new Customer(data);

    return await customer.save();
  },

  async update(data, _id) {
    const existing = await Customer.exists({ _id });

    if (!existing) {
      throwError("مشتری با این مشخصات یافت نشد.", 404);
    }

    const updated = await Customer.findByIdAndUpdate(_id, data, { new: true });

    return updated;
  },

  async getAll({
    search = "",
    sort = [{ field: "createdAt", order: "desc" }],
    page = 1,
    page_size = 10,
    filters = {},
  }) {
    const query = buildMongoFindQuery(filters, search, [
      "firstName",
      "lastName",
      "phone",
      "email",
    ]);
    const sortOption = buildMongoSort(sort);
    const skip = (page - 1) * page_size;

    const [customers, total] = await Promise.all([
      Customer.find(query).sort(sortOption).skip(skip).limit(page_size).lean(),
      Customer.find(query).countDocuments(),
    ]);

    return { customers, total };
  },

  async getDetails(_id) {
    const existing = await Customer.exists({_id});

    if (!existing) {
      throwError("مشتری با این مشخصات یافت نشد.", 404);
    }

    const customer = await Customer.findById(_id);

    return customer;
  },

  async delete(_id) {
    const existing = await Customer.exists({ _id });

    if (!existing) {
      throwError("مشتری با این مشخصات یافت نشد.", 404);
    }

    const deleted = await Customer.findByIdAndDelete(_id);

    return deleted;
  },

  async signup(data) {
    const customer = await this.create(data);

    const token = generateToken({
      id: customer._id,
      type: "customer",
    });

    const { password: _, ...customerData } = customer.toObject();

    return { customer: customerData, token };
  },

  async login(data) {
    const existing = await Customer.findOne({ phone: data.phone });

    if (!existing) {
      throwError("مشخصات کاربری اشتباه است.", 401);
    }

    const isMatch = await bcrypt.compare(data.password, existing.password);
    if (!isMatch) {
      throwError("مشخصات کاربری اشتباه است.", 401);
    }

    const token = generateToken({
      id: existing._id,
      type: "customer",
    });

    const { password: _, ...customerData } = existing.toObject();

    return { customer: customerData, token };
  },

  async getDashboardData(){
    return await Customer.countDocuments()
  }
};

module.exports = customerService;
