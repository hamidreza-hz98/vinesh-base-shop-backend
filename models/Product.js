const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");
const SeoSchema = require("./SEO");

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    trim: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  discount: {
    type: Number,
    required: true,
    default: 0,
  },
  description: {
    type: String,
    default: "",
  },

  media: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      default: [],
    },
  ],

  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  relatedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: [],
    },
  ],
  visits: {
    type: Number,
    default: 0,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  ],
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
  },
  soldNumber: {
    type: Number,
    default: 0,
  },

  shortSpecifications: [
    {
      key: String,
      value: String,
    },
  ],

  specifications: [
    {
      key: String,
      value: String,
    },
  ],
  seo: {
    type: SeoSchema,
    default: () => ({}),
  },
});

ProductSchema.plugin(timestamps);

ProductSchema.index({ categories: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ visits: -1 });
ProductSchema.index({ soldNumber: -1 });

module.exports = mongoose.model("Product", ProductSchema);
