const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");
const SeoSchema = require("./SEO");

const CategorySchema = new Schema({
  name: {
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
    required: true,
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
    default: null,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: [],
    },
  ],
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      default: [],
    },
  ],
  seo: {
    type: SeoSchema,
    default: () => ({}),
  },
  visits: {
    type: Number,
    default: 0,
  },
});

CategorySchema.plugin(timestamps);

CategorySchema.index({ tags: 1 });
CategorySchema.index({ children: 1 });
CategorySchema.index({ visits: -1 });

module.exports = mongoose.model("Category", CategorySchema);
