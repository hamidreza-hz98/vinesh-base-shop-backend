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

  for (const key in filters) {
    const filter = filters[key];

    switch (filter.type) {
      case "eq":
        query[key] = filter.value;
        break;
      case "in":
        query[key] = { $in: filter.value };
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
        query[key] = { $gte: new Date(filter.from), $lte: new Date(filter.to) };
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
  if (!sort || !sort.field) return {};

  const order = sort.order === "desc" ? -1 : 1;

  return {
    [sort.field]: order,
  };
}

module.exports = { buildMongoQuery, buildMongoSort, buildMongoSearchQuery, buildMongoFindQuery };
