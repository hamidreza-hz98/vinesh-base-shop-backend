const Product = require("../../models/Product");
const throwError = require("../../middlewares/throw-error");
const { buildMongoFindQuery, buildMongoSort } = require("../../lib/filter");
const { generateProductSchema } = require("../../lib/seo");

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
    sort = [{ field: "createdAt", order: "desc" }],
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
      Product.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(page_size)
        .select(
          "title media excerpt price discount createdAt updatedAt stock visits brand slug"
        )
        .populate("media brand")
        .lean(),
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

    const product = await Product.findOneAndUpdate(
      filter,
      { $inc: { visits: 1 } },
      { new: true }
    )
      .populate("categories media seo.ogImage seo.twitterImage tags brand")
      .populate({
        path: "relatedProducts",
        populate: {
          path: "media",
        },
      });

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

  async updateStock(cartProducts) {
    if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
      throwError("لیست محصولات معتبر نیست", 400);
    }

    const productIds = cartProducts.map((item) => item.product._id);
    const existingProducts = await Product.find({ _id: { $in: productIds } });

    const productMap = new Map(existingProducts.map((p) => [String(p._id), p]));

    for (const item of cartProducts) {
      const productId = String(item.product._id);
      const quantity = item.quantity;

      const product = productMap.get(productId);
      if (!product) {
        throwError(`محصول با شناسه ${productId} یافت نشد`, 404);
      }

      if (product.stock < quantity) {
        throwError(`موجودی محصول ${product.title} کافی نیست`, 400);
      }
    }

    const bulkOps = cartProducts.map((item) => ({
      updateOne: {
        filter: { _id: item.product._id },
        update: {
          $inc: { stock: -item.quantity },
          $inc: { soldNumber: item.quantity },
        },
      },
    }));

    await Product.bulkWrite(bulkOps);

    return true;
  },

  async getSeoData(filter) {
    const product = await Product.findOne(filter)
      .select("seo price discount brand slug stock categories")
      .populate("seo.ogImage seo.twitterImage brand categories");

    if (!product) {
      throwError("محصولی با این شناسه یافت نشد.", 404);
    }

    const schema = generateProductSchema(product);

    return { seo: product.seo, schema };
  },

  async getProductsForSitemap() {
    const products = await Product.find().select("slug updatedAt").lean();

    return products.map((p) => ({
      url: `${process.env.BASE_URL}/products/${p.slug}`,
      lastmod: p.updatedAt.toISOString(),
    }));
  },

  async getDashboardData() {
    const totalProducts = await Product.countDocuments();

    const mostVisitedProducts = await Product.find()
    .select("title slug excerpt price discount media stock visits soldNumber").populate("media")
      .sort({ visits: -1 })
      .limit(10);

    const mostSoldProducts = await Product.find()
    .select("title slug excerpt price discount media stock visits soldNumber").populate("media")
      .sort({ soldNumber: -1 })
      .limit(10);

    return { totalProducts, mostVisitedProducts, mostSoldProducts };
  },
};

module.exports = productService;
