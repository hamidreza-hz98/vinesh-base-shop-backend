const Cart = require("../../models/Cart");
const throwError = require("../../middlewares/throw-error");
const productService = require("../product/product.service");

const cartService = {
  async create(data) {
    const existing = await Cart.exists({ customer: data.customer });

    if (existing) {
      throwError("کاربر در حال حاضر یک سبد خرید فعال دارد.", 409);
    }

    const cart = new Cart(data);

    return await cart.save();
  },

  /**
   * Updates the cart based on action
   * @param {String} customerId - MongoDB ObjectId of customer
   * @param {Object} options - action data
   *   options = {
   *     action: 'add' | 'decrease' | 'remove' | 'setAddress' | 'setPayment' | 'setCustomer',
   *     productId?, quantity?, addressId?, payment?, customerId?
   *   }
   */

  async update(customerId, options = {}) {
    // Find or create cart
    let cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      cart = await Cart.create({
        customer: customerId,
        products: [],
        price: {},
      });
    }

    const { action } = options;

    switch (action) {
      case "add":
        await this.addProduct(cart, options.productId, options.quantity || 1);
        break;

      case "decrease":
        await this.decreaseProduct(
          cart,
          options.productId,
          options.quantity || 1
        );
        break;

      case "remove":
        await this.removeProduct(cart, options.productId);
        break;

      case "setAddress":
        cart.address = options.addressId || null;
        break;

      case "setPayment":
        cart.payment = options.payment || {};
        break;

      case "setCustomer":
        cart.customer = options.customerId || customerId;
        break;

      default:
        throw new Error("Unknown cart action");
    }

    // Recalculate prices after every change
    await this.recalculatePrices(cart);

    await cart.save();
    return cart;
  },

  /** Adds a product or increases quantity */
  async addProduct(cart, productId, quantity = 1) {
    if (!productId) throw new Error("productId is required for add action");

    const existingIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );
    if (existingIndex > -1) {
      cart.products[existingIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }
  },

  /** Decreases quantity or removes product if quantity <= 0 */
  async decreaseProduct(cart, productId, quantity = 1) {
    if (!productId)
      throw new Error("productId is required for decrease action");

    const existingIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );
    if (existingIndex === -1) return;

    cart.products[existingIndex].quantity -= quantity;
    if (cart.products[existingIndex].quantity <= 0) {
      cart.products.splice(existingIndex, 1);
    }
  },

  /** Remove a product completely from cart */
  async removeProduct(cart, productId) {
    if (!productId) throw new Error("productId is required for remove action");

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );
  },

  /** Recalculates the price fields */
  async recalculatePrices(cart) {
    const productIds = cart.products.map((p) => p.product);
    const products = await productService
      .getAll({ filters: { _id: { value: productIds, type: "in" } } })
      .lean();

    let productsTotal = 0;
    cart.products.forEach((cartItem) => {
      const product = products.find(
        (p) => p._id.toString() === cartItem.product.toString()
      );
      if (product) {
        const finalPrice = product.price - product.discount;
        productsTotal += finalPrice * cartItem.quantity;
      }
    });

    cart.price = {
      products: productsTotal,
      shipment: cart.price.shipment || 0,
      discounts: cart.price.discounts || 0,
    };
  },

  async getCustomerCart(customerId) {
    const customerCart = await Cart.findOne({ customer: customerId }).lean();

    if (!customerCart) {
      throwError("سبد خریدی برای کاربر یافت نشد.", 404);
    }

    return customerCart;
  },
};

module.exports = cartService;
