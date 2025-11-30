const Order = require("../../models/Order");
const throwError = require("../../middlewares/throw-error");
const { buildMongoFindQuery, buildMongoSort } = require("../../lib/filter");
const cartService = require("../cart/cart.service");
const productService = require("../product/product.service");
const {calculateFinalPrice} = require("../../lib/number");
const moment = require("jalali-moment");

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
    sort = [{ field: "createdAt", order: "desc" }],
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

  async addTransactionToOrder(orderId, transactionId) {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { $push: { transactions: transactionId } },
      { new: true }
    );

    if (!order) {
      throwError("Order not found");
    }

    return order;
  },

  async getDashboardData(status){
    const totalOrders = await Order.countDocuments()
   
    const orders = await Order.find({ status }).select("customer code createdAt price").populate("customer").limit(10)
   
    const totalSales = await this.calculateTotalSales()
   
    const orderRevenueData = await this.calculateOrderRevenue()
    
    return { totalOrders, orders, totalSales, orderRevenueData }
  },
  
  async calculateTotalSales(){
    const orders = await Order.find({ status: "delivered" }).select("price")
    let totalSales = 0
    
    for(const order of orders ){
      const finalPrice = calculateFinalPrice(order.price)

      totalSales += finalPrice
    }

    return totalSales
  },

  async calculateOrderRevenue () {
  try {
    moment.locale("fa")
    // date range : from 12 months ago (start of that month) until now
    const end = moment().endOf("jMonth") // end of current jalali month
    const start = moment().subtract(11, "jMonth").startOf("jMonth")

    const orders = await Order.find({
      status: "delivered",
      createdAt: {
        $gte: start.toDate(),
        $lte: end.toDate(),
      },
    })

    // prepare base months
    const months = []

    for (let i = 0; i < 12; i++) {
      const m = moment(start).add(i, "jMonth")

      months.push({
        key: m.format("jYYYY-jMM"),
        time: m.format("jMMMM jYYYY"), // مثال: شهریور 1404
        totalSales: 0,
      })
    }

    // calculate revenue per month
    for (const order of orders) {
      const orderDate = moment(order.createdAt)
      const orderKey = orderDate.format("jYYYY-jMM")

      const monthIndex = months.findIndex((m) => m.key === orderKey)

      if (monthIndex !== -1) {
        const total = calculateFinalPrice(order.price)

        // تبدیل به «میلیون تومان»
        months[monthIndex].totalSales += total / 1_000_000
      }
    }

    // رند کردن (مثلا: 18.4 → 18)
    const finalData = months.map((m) => ({
      time: m.time,
      totalSales: Math.round(m.totalSales),
    }))

    return finalData
  } catch (error) {
    console.error("Error in calculateOrderRevenue:", error)
    throwError("خطا در محاسبه درآمد ماهانه", 500)
  }
}
};

module.exports = orderService;
