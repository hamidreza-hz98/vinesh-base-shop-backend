const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");

const AddressSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  recipientName: {
    type: String,
    default: "",
  },
  recipientPhone: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  province: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
});

AddressSchema.plugin(timestamps);

module.exports = mongoose.model("Address", AddressSchema);
