const Cart = require("../../models/Cart");
const throwError = require("../../middlewares/throw-error");
const productService = require("../product/product.service");

const cartService = {
  async create(data) {
    if (Object.keys(data).length !== 0) {
      const existing = await Cart.exists({ customer: data.customer });

      if (existing) {
        throwError("کاربر در حال حاضر یک سبد خرید فعال دارد.", 409);
      }
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

  async update(_id, options = {}) {
    // Find or create cart
    let cart = await Cart.findOne({ _id })
      .populate("address")
      .populate({
        path: "products",
        populate: {
          path: "product",

          populate: "media",
        },
      });

    if (!cart) {
      cart = await Cart.create({
        customer: options.customerId || null,
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
        cart.customer = options.customerId;
        break;

      default:
        throw new Error("Unknown cart action");
    }

    // Recalculate prices after every change
    await this.recalculatePrices(cart);

    await cart.save();

    await cart.populate("address");
    await cart.populate({
      path: "products",
      populate: {
        path: "product",

        populate: "media",
      },
    });

    return cart;
  },

  /** Adds a product or increases quantity */
  async addProduct(cart, productId, quantity = 1) {
    if (!productId) throw new Error("productId is required for add action");

    const existingIndex = cart.products.findIndex((p) => {
      const id =
        typeof p.product === "object"
          ? p.product._id.toString()
          : p.product.toString();
      return id === productId.toString();
    });

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

    const existingIndex = cart.products.findIndex((p) => {
      const id =
        typeof p.product === "object"
          ? p.product._id.toString()
          : p.product.toString();
      return id === productId.toString();
    });

    if (existingIndex === -1) return;

    cart.products[existingIndex].quantity -= quantity;

    if (cart.products[existingIndex].quantity <= 0) {
      cart.products.splice(existingIndex, 1);
    }
  },

  /** Remove a product completely from cart */
  async removeProduct(cart, productId) {
    if (!productId) throw new Error("productId is required for remove action");

    cart.products = cart.products.filter((p) => {
      const id =
        typeof p.product === "object"
          ? p.product._id.toString()
          : p.product.toString();

      return id !== productId.toString();
    });
  },

  async recalculatePrices(cart) {
    let productsMap = new Map();

    const isPopulated =
      cart.products?.[0]?.product &&
      typeof cart.products[0].product === "object" &&
      "price" in cart.products[0].product; // <--- FIX

    // If populated: build a quick map
    if (isPopulated) {
      cart.products.forEach((item) => {
        productsMap.set(item.product._id.toString(), item.product);
      });
    } else {
      // If NOT populated: fetch products
      const productIds = cart.products.map((p) => p.product);

      const response = await productService.getAll({
        filters: { _id: { value: productIds, type: "in" } },
      });

      const products = response.products || response.data || response || [];

      products.forEach((p) => {
        productsMap.set(p._id.toString(), p);
      });
    }

    let productsTotal = 0;
    let discountTotal = 0;

    cart.products.forEach((cartItem) => {
      const productId =
        typeof cartItem.product === "object"
          ? cartItem.product._id.toString() // populated
          : cartItem.product.toString(); // not populated

      const product = productsMap.get(productId);

      if (product) {
        const price = product.price || 0;
        const discount = product.discount || 0;

        const itemOriginalPrice = price * cartItem.quantity;
        const itemDiscount = discount * cartItem.quantity;
        const itemFinalPrice = itemOriginalPrice;

        discountTotal += itemDiscount;
        productsTotal += itemFinalPrice;
      }
    });

    if (!cart.price) cart.price = {};

    cart.price.products = productsTotal;
    cart.price.discounts = discountTotal;
    cart.price.shipment = cart.price.shipment || 0;
  },

  async getCustomerCart(customerId) {
    let customerCart = await Cart.findOne({ customer: customerId })
      .populate("address")
      .populate({
        path: "products",
        populate: {
          path: "product",

          populate: "media",
        },
      })
      .lean();

    if (!customerCart) {
      customerCart = await Cart.create({
        customer: customerId,
        products: [],
        price: {},
      });
    }

    return customerCart;
  },

  async getCart(_id) {
    const cart = await Cart.findById(_id)
      .populate("address")
      .populate({
        path: "products",
        populate: {
          path: "product",

          populate: "media",
        },
      });

    if (!cart) {
      cart = await Cart.create({
        customer: customerId,
        products: [],
        price: {},
      });
    }

    return cart;
  },

  async delete(_id) {
    const existing = await Cart.exists({ _id });

    if (!existing) {
      throwError("سبد خرید با این شناسه یافت نشد.");
    }

    const deletedCart = await Cart.findByIdAndDelete(_id);

    return deletedCart;
  },
};

module.exports = cartService;
