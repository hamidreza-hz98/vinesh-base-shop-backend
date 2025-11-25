const Category = require("../../models/Category");
const throwError = require("../../middlewares/throw-error");
const { buildMongoFindQuery, buildMongoSort } = require("../../lib/filter");

const categoryService = {
  async exists(filter) {
    return await Category.findOne(filter).lean();
  },

  async create(data) {
    const existing = await this.exists({ slug: data.slug });

    if (existing) {
      throwError("دسته بندی با این مشخصات وجود دارد.", 409);
    }

    const category = new Category(data);

    return category.save();
  },

  async update(data, _id) {
    const existing = await this.exists({ _id });

    if (!existing) {
      throwError("دسته بندی مورد نظر یافت نشد.", 404);
    }

    const updated = await Category.findByIdAndUpdate(_id, data, { new: true });

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
      "slug",
      "description",
    ]);

    const sortOption = buildMongoSort(sort);
    const skip = (page - 1) * page_size;

    const [categories, total] = await Promise.all([
      Category.find(query).sort(sortOption).skip(skip).limit(page_size).populate("children image").lean(),
      Category.countDocuments(query),
    ]);

    return { categories, total };
  },

  async getDetails(filter) {
    if (!filter || Object.keys(filter).length === 0) {
      throwError(
        "فیلتر مورد نیاز برای دریافت جزئیات دسته بندی ارسال نشده است.",
        400
      );
    }

    const category = await Category.findOne(filter).populate("image seo.ogImage seo.twitterImage tags children").lean();

    if (!category) {
      throwError("دسته بندی مورد نظر یافت نشد.", 404);
    }

    return category;
  },

  async delete(_id) {
    const existing = await this.exists({ _id });

    if (!existing) {
      throwError("دسته بندی مورد نظر یافت نشد.", 404);
    }

    const deleted = await Category.findByIdAndDelete(_id);

    return deleted;
  },
};

module.exports = categoryService;
