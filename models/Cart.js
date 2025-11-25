const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");

const CartSchema = new Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
      },
    },
  ],
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  description: {
    type: String,
    default: "",
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    default: null,
  },
  payment: {
    type: Object,
    default: {},
  },
  price: {
    products: {
      type: Number,
      default: 0,
      min: 0,
    },
    shipment: {
      type: Number,
      default: 0,
      min: 0,
    },
    discounts: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
});

CartSchema.plugin(timestamps);

// Indexes
CartSchema.index({ "products.product": 1 });
CartSchema.index({ createdAt: -1 });
CartSchema.index({ updatedAt: -1 });

module.exports = mongoose.model("Cart", CartSchema);
