const mongoose = require("mongoose");
const { Schema } = mongoose;

const SeoSchema = new Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  keywords: { type: String, default: "" },
  ogTitle: { type: String, default: "" },
  ogDescription: { type: String, default: "" },
  ogImage: { type: mongoose.Schema.Types.ObjectId, ref: "Media", default: null },
  twitterTitle: { type: String, default: "" },
  twitterDescription: { type: String, default: "" },
  twitterImage: { type: mongoose.Schema.Types.ObjectId, ref: "Media", default: null },
  canonical: { type: String, default: "" },
  robots: { type: String, default: "" },
  additionalMetaTags: { type: String, default: "" },
});

module.exports = SeoSchema