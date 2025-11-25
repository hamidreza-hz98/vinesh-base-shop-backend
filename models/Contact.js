const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");

const ContactSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
});

ContactSchema.plugin(timestamps);

module.exports = mongoose.model("Contact", ContactSchema);
