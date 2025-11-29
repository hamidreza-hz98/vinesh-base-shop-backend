const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");
const { createOrderCode } = require("../lib/general");

const OrderSchema = new Schema({
  code: {
    type: String,
    unique: true,
    default: () => createOrderCode(),
  },
  status: {
    type: String,
    enum: ["pending_payment", "processing", "failed", "shipping", "delivered"],
    required: true,
    default: "pending_payment",
    trim: true,
  },
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
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  address: {
    type: Schema.Types.Mixed,
    required: true,
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    default: null
  }],
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
  shipmentDate: {
    type: Date,
    default: null,
  },
  shipmentTrackNumber: {
    type: String,
    default: "",
  },
});

OrderSchema.plugin(timestamps);

OrderSchema.index({ customer: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ transaction: 1 });
OrderSchema.index({ shipmentTrackNumber: 1 }, { sparse: true });
OrderSchema.index({ shipmentDate: 1 });
OrderSchema.index({ customer: 1, status: 1 });

module.exports = mongoose.model("Order", OrderSchema);
