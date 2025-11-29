const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");

const TransactionSchema = new Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },

  gateway: { type: String, default: "zarinpal" },

  amount: { type: Number, required: true },

  currency: { type: String, enum: ["IRR"], default: "IRR" },

  description: String,

  metadata: { type: Object },

  authority: String,

  refId: Number,

  status: {
    type: String,
    enum: ["PENDING", "PENDING_REDIRECT", "SUCCESS", "FAILED", "CANCELLED"],
    default: "PENDING",
  },

  attempt: { type: Number, default: 0 },

  error: { code: Number, message: String },
});

TransactionSchema.plugin(timestamps);

TransactionSchema.index({ status: 1 });
TransactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Transaction", TransactionSchema);
