const Order = require("../../models/Order");
const throwError = require("../../middlewares/throw-error");
const { buildMongoFindQuery, buildMongoSort } = require("../../lib/filter");

const orderService = {
  async create(data) {
    const order = new Order(data);

    return await order.save();
  },

  async update(data, _id) {
    const existing = await Order.exists({ _id });

    if (!existing) {
      throwError("سفارش یافت نشد.", 404);
    }

    const updated = await Order.findByIdAndUpdate(_id, data, { new: true });

    return updated;
  },

  async getAll({
    search = "",
    sort = { field: "createdAt", order: "desc" },
    page = 1,
    page_size = 10,
    filters = {},
  }) {
    const query = buildMongoFindQuery(filters, search, [
      "code",
      "customer",
      "description",
    ]);
    const sortOption = buildMongoSort(sort);
    const skip = (page - 1) * page_size;

    const [orders, total] = await Promise.all([
      Order.find(query).sort(sortOption).skip(skip).limit(page_size).lean(),
      Order.find(query).countDocuments(),
    ]);

    return { orders, total };
  },

  async getCustomerOrders(customerId, data) {
    const { orders, total } = await this.getAll({
      ...data,
      filters: {
        ...data.filters,
        customer: {
          value: customerId,
          type: "eq",
        },
      },
    });

    return { orders, total };
  },
};

module.exports = orderService;
