const customerService = require("../customer/customer.service");
const orderService = require("../order/order.service");
const productService = require("../product/product.service");

const dashboardService = {
  async getDashboardData(status) {
    const allCustomers = await customerService.getDashboardData();

    
    
    const { totalProducts, mostVisitedProducts, mostSoldProducts } =
    await productService.getDashboardData();
    
    const { totalOrders, orders, totalSales, orderRevenueData } =
      await orderService.getDashboardData(status);

    return {
      allCustomers,
      totalProducts,
      mostVisitedProducts,
      mostSoldProducts,
      totalOrders,
      orders,
      totalSales,
      orderRevenueData,
    };
  },
};

module.exports = dashboardService;
