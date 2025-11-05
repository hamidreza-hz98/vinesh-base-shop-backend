const Product = require("../../models/Product");
const throwError = require("../../middlewares/throw-error");
const { buildMongoFindQuery, buildMongoSort } = require("../../lib/filter");

const productService = {
  async create(data) {
    const existing = await Product.exists({ slug: data.slug });

    if (existing) {
      throwError("محصولی با این نامک قبلا ثبت شده است", 409);
    }

    const product = new Product(data);

    return await product.save();
  },

  async update(data, _id) {
    const existing = await Product.exists({ _id });

    if (!existing) {
      throwError("محصول مورد نظر یافت نشد", 404);
    }

    const updated = await Product.findByIdAndUpdate(_id, data, { new: true });

    return updated;
  },

  async getAll({
    search = "",
    sort = { field: "createdAt", order: "desc" },
    page = 1,
    page_size = 10,
    filters = {},
  }) {
    const query = buildMongoFindQuery(filters, search, [
      "title",
      "excerpt",
      "description",
    ]);
    const sortOption = buildMongoSort(sort);
    const skip = (page - 1) * page_size;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(page_size).lean(),
      Product.countDocuments(query),
    ]);

    return {
      products,
      total,
    };
  },

  async getDetails(filter) {
    if (!filter || Object.keys(filter).length === 0) {
      throwError(
        "فیلتر مورد نیاز برای دریافت جزئیات محصول ارسال نشده است",
        400
      );
    }

    const product = await Product.findOne(filter);

    if (!product) {
      throwError("محصول مورد نظر یافت نشد", 404);
    }

    return product;
  },

  async delete(_id) {
    const existing = await Product.exists({ _id });

    if (!existing) {
      throwError("محصول مورد نظر یافت نشد", 404);
    }

    const product = await Product.findByIdAndDelete(_id);

    return product;
  },
};

module.exports = productService;
