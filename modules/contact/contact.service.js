const { buildMongoSort, buildMongoFindQuery } = require("../../lib/filter");
const Contact = require("../../models/Contact");

const contactService = {
  async submit(data) {
    const contact = new Contact(data);

    return await contact.save();
  },

  async getAll({
    search = "",
    sort = [{ field: "createdAt", order: "desc" }],
    page = 1,
    page_size = 10,
    filters = {},
  }) {
    const query = buildMongoFindQuery(filters, search, [
      "fullName",
      "mobile",
      "message",
    ]);
    const sortOption = buildMongoSort(sort);
    const skip = (page - 1) * page_size;

    const [contacts, total] = await Promise.all([
      Contact.find(query).sort(sortOption).skip(skip).limit(page_size).lean(),
      Contact.countDocuments(query),
    ]);

    return { contacts, total };
  },
};

module.exports = contactService;
