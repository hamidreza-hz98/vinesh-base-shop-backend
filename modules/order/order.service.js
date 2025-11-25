const Order = require("../../models/Order");
const throwError = require("../../middlewares/throw-error");
const { buildMongoFindQuery, buildMongoSort } = require("../../lib/filter");
const cartService = require("../cart/cart.service");
const productService = require("../product/product.service");

const orderService = {
  async create(data) {
    const cartProducts = data.cart.products;

    await productService.updateStock(cartProducts);

    const newOrder = new Order({
      ...data,
      products: cartProducts,
      price: data.cart.price,
      address: data.cart.address,
    });

    await cartService.delete(data.cart._id);

    return await newOrder.save();
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
      Order.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(page_size)
        .populate("customer")
        .populate({
          path: "products",
          populate: {
            path: "product",

            populate: "media",
          },
        })
        .lean(),
      Order.find(query).countDocuments(),
    ]);

    return { orders, total };
  },

  async getDetails(_id) {
    const order = await Order.findById(_id)
      .populate("customer")
      .populate({
        path: "products",
        populate: {
          path: "product",

          populate: "media",
        },
      });

    if (!order) {
      throwError("سفارش با این شناسه یافت نشد.", 404);
    }

    return order;
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

  async getCustomerOrderDetails(code, customerId) {
    const order = await Order.findOne({ code })
      .populate({
        path: "products",
        populate: {
          path: "product",

          populate: "media",
        },
      })
      .lean();

    if (!order) {
      throwError("سفارش با این شناسه یافت نشد.", 404);
    }

    if (String(order.customer) !== String(customerId)) {
      throwError("دسنرسی غیر مجاز", 401);
    }

    return order;
  },
};

module.exports = orderService;
