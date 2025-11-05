const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");
const SeoSchema = require("./SEO");

const BrandSchema = new Schema({
  logo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
    default: null,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      default: [],
    },
  ],
  name: {
    type: String,
    required: true,
  },
  englishName: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  seo: {
    type: SeoSchema,
    default: () => ({}),
  },
  visits: {
    type: Number,
    default: 0,
  },
});

BrandSchema.plugin(timestamps);

BrandSchema.index({ categories: 1 });
BrandSchema.index({ tags: 1 });
BrandSchema.index({ visits: -1 });
BrandSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Brand", BrandSchema);
