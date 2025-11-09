const Brand = require("../../models/Brand");
const throwError = require("../../middlewares/throw-error");
const { buildMongoFindQuery, buildMongoSort } = require("../../lib/filter");

const brandService = {
  async exists(filter) {
    return await Brand.findOne(filter).lean();
  },

  async create(data) {
    const existing = await this.exists({ slug: data.slug });

    if (existing) {
      throwError("برند با این مشخصات وجود دارد.", 409);
    }

    const brand = new Brand(data);

    return await brand.save();
  },

  async update(data, _id) {
    const existing = this.exists({ _id });

    if (!existing) {
      throwError("برند مورد نظر یافت نشد.", 404);
    }

    const updated = await Brand.findByIdAndUpdate(_id, data, { new: true });

    return updated;
  },

  async getAll({
    search = "",
    sort = [{ field: "createdAt", order: "desc" }],
    page = 1,
    page_size = 10,
    filters = {},
  }) {
    const query = buildMongoFindQuery(filters, search, [
      "name",
      "englishName",
      "description",
    ]);
    const sortOption = buildMongoSort(sort);
    const skip = (page - 1) * page_size;

    const [brands, total] = await Promise.all([
      Brand.find(query).sort(sortOption).skip(skip).limit(page_size).populate("logo tags").lean(),
      Brand.countDocuments(query),
    ]);

    return {
      brands,
      total,
    };
  },

  async getDetails(filter) {
    if (!filter || Object.keys(filter).length === 0) {
      throwError(
        "فیلتر مورد نیاز برای دریافت جزئیات برند ارسال نشده است.",
        400
      );
    }

    const brand = await Brand.findOneAndUpdate(
      filter,
      { $inc: { visits: 1 } },
      { new: true }
    )
    .populate("logo seo.ogImage seo.twitterImage tags")
    .lean();

    if (!brand) {
      throwError("برند مورد نظر یافت نشد.", 404);
    }

    return brand;
  },

  async delete(_id) {
    const existing = await this.exists({ _id });

    if (!existing) {
      throwError("برند مورد نظر یافت نشد.", 404);
    }

    const deleted = await Brand.findByIdAndDelete(_id);

    return deleted;
  },
};

module.exports = brandService;
