const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");
const { slugify } = require("../lib/general");

const TagSchema = new Schema({
  name: {
    type: String,
    required: true,
     trim: true,
  },
  slug: {
    type: String,
  },
});

TagSchema.plugin(timestamps);


TagSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name);
  }
  next();
});

TagSchema.pre(["findOneAndUpdate", "findByIdAndUpdate"], function (next) {
  const update = this.getUpdate();

  const name = update?.$set?.name || update?.name;
  if (name) {
    const newSlug = slugify(name);

    if (update.$set) {
      update.$set.slug = newSlug;
    } else {
      update.slug = newSlug;
    }

    this.setUpdate(update);
  }

  next();
});

module.exports = mongoose.model("Tag", TagSchema);
