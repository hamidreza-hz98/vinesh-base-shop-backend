/**
 * Builds a MongoDB search query using regex on multiple fields
 *
 * @param {string} search - search text
 * @param {string[]} searchFields - list of fields to search on
 * @returns {Object} MongoDB query for search
 *
 * Example:
 *   buildMongoSearchQuery("iphone", ["name", "description"])
 *   → { $or: [ { name: /iphone/i }, { description: /iphone/i } ] }
 */
function buildMongoSearchQuery(search, searchFields = []) {
  if (!search || !searchFields.length) return {};

  return {
    $or: searchFields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    })),
  };
}

function buildMongoQuery(filters) {
  const query = {};

  // 🧩 Check if filters is a JSON string
  if (typeof filters === "string") {
    try {
      filters = JSON.parse(filters);
    } catch (err) {
      console.warn("⚠️ Invalid JSON filters string, ignoring:", err.message);
      return query; // return empty query to avoid runtime error
    }
  }

  // 🧠 Ensure filters is an object
  if (typeof filters !== "object" || filters === null) {
    return query;
  }

  for (const key in filters) {
    const filter = filters[key];
    if (!filter || typeof filter !== "object") continue;

    switch (filter.type) {
      case "eq":
        query[key] = filter.value;
        break;

      case "in":
        query[key] = { $in: filter.value };
        break;

      case "gt":
        query[key] = { $gt: filter.value };
        break;

      case "lt":
        query[key] = { $lt: filter.value };
        break;

      case "gte":
        query[key] = { $gte: filter.value };
        break;

      case "lte":
        query[key] = { $lte: filter.value };
        break;

      case "range":
        query[key] = {};
        if (filter.from !== undefined) query[key].$gte = filter.from;
        if (filter.to !== undefined) query[key].$lte = filter.to;
        break;

      case "regex":
        query[key] = { $regex: filter.value, $options: "i" };
        break;

      case "exists":
        query[key] = { $exists: filter.value };
        break;

      case "between":
        query[key] = {
          $gte: new Date(filter.from),
          $lte: new Date(filter.to),
        };
        break;

      case "hasChildren":
        query[filter.field || key] = { $exists: true, $ne: [] };
        break;

      case "noChildren":
        query[filter.field || key] = { $size: 0 };
        break;
    }
  }

  return query;
}


/**
 * Merges filters and search query for MongoDB .find()
 *
 * @param {Object} filters - structured filters object
 * @param {string} search - search text
 * @param {string[]} searchFields - fields for search
 * @returns {Object} Final query for Model.find()
 */
function buildMongoFindQuery(filters, search, searchFields = []) {
  const filterQuery = buildMongoQuery(filters);
  const searchQuery = buildMongoSearchQuery(search, searchFields);

  if (!searchQuery.$or) return filterQuery; // no search, only filters
  if (!Object.keys(filterQuery).length) return searchQuery; // only search

  return {
    $and: [filterQuery, searchQuery],
  };
}

/**
 * Converts shared sort object to MongoDB sort format.
 *
 * @param {Object} sort - Shared sort object
 * @param {string} sort.field - Field name to sort by
 * @param {"asc"|"desc"} sort.order - Sort order
 * @returns {Object} Mongo sort object
 *
 * Usage:
 *   buildMongoSort({ field: "price", order: "desc" })
 *   → { price: -1 }
 */
function buildMongoSort(sort) {
  if (!sort) return {};

  let sortArray = sort;

  // If string → parse
  if (typeof sort === "string") {
    try {
      sortArray = JSON.parse(sort);
    } catch (e) {
      console.warn("Invalid sort JSON:", sort);
      return {};
    }
  }

  // Normalize to array
  if (!Array.isArray(sortArray)) {
    sortArray = [sortArray];
  }

  const sortObject = {};

  for (const item of sortArray) {
    if (!item || typeof item !== "object") continue;
    const { field, order } = item;
    if (!field) continue;
    sortObject[field] = order === "desc" ? -1 : 1;
  }

  return sortObject;
}

module.exports = {
  buildMongoQuery,
  buildMongoSort,
  buildMongoSearchQuery,
  buildMongoFindQuery,
};
