const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const timestamps = require("mongoose-timestamp");

const CustomerSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    default: "",
  },
  lastName: {
    type: String,
    required: true,
    default: "",
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    default: "",
  },
  password: {
    type: String,
    default: "",
  },
  birthdate: {
    type: Date,
  },
});

CustomerSchema.plugin(timestamps);

CustomerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

CustomerSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }

  next();
});

CustomerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

CustomerSchema.index({ firstName: 1, lastName: 1 });
CustomerSchema.index({ birthdate: 1 });
CustomerSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Customer", CustomerSchema);
