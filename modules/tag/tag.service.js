const Tag = require("../../models/Tag");
const throwError = require("../../middlewares/throw-error");
const { buildMongoFindQuery, buildMongoSort } = require("../../lib/filter");
const { slugify } = require("../../lib/general");

const tagService = {
  async create(data) {
    const existing = await Tag.exists({ slug: slugify(data.name) });
    
    
    
    if (existing) {
      throwError("برچسب با این نام قبلا ایجاد شده است", 409);
    }
    
    const tag = new Tag(data);
    
    return await tag.save();
  },

  async update(data, _id) {
    const existing = await Tag.exists({ _id });

    if (!existing) {
      throwError("برچسب مورد نظر یافت نشد", 404);
    }

    const updated = await Tag.findByIdAndUpdate(_id, data, { new: true });

    return updated;
  },

  async getAll({
    search = "",
    sort = { field: "createdAt", order: "desc" },
    page = 1,
    page_size = 10,
    filters = {},
  }) {
    const query = buildMongoFindQuery(filters, search, ["name"]);
    const sortOption = buildMongoSort(sort);
    const skip = (page - 1) * page_size;

    const [tags, total] = await Promise.all([
      Tag.find(query).sort(sortOption).skip(skip).limit(page_size).lean(),
      Tag.countDocuments(query),
    ]);

    return {
      tags,
      total,
    };
  },

  async getDetails(filter) {
    if (!filter || Object.keys(filter).length === 0) {
      throwError("فیلتر جستجو ارائه نشده است.", 400);
    }

    const tag = await Tag.findOne(filter).lean();

    if (!tag) {
      throwError("برچسب مورد نظر یافت نشد.", 404);
    }

    return tag;
  },

  async delete(_id) {
    const existing = await Tag.exists({ _id });

    if (!existing) {
      throwError("برچسب مورد نظر یافت نشد", 404);
    }

    const tag = await Tag.findByIdAndDelete(_id);

    return tag;
  },
};

module.exports = tagService;
