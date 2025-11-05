const _ = require("lodash");
const Settings = require("../../models/Settings");
const throwError = require("../../middlewares/throw-error")

const settingsService = {
  /**
   * Update Settings
   * - If no settings found, it creates one
   * - Performs deep merge update
   */
  async update(data) {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    const updatedData = _.merge({}, settings.toObject(), data);

    await Settings.updateOne({ _id: settings._id }, updatedData, { new: true });

    return updatedData;
  },

  /**
   * Get a specific section of Settings
   * @param {string} section
   */
  async getSection(section) {
    const validSections = ["defaultSeo", "general", "faq", "terms", "about"];

    if (!validSections.includes(section)) {
      throwError("تنظیماتی یافت نشد.");
    }

    const settings = await Settings.findOne().lean();

    if (!settings) {
      throwError("تنظیماتی یافت نشد.");
    }

    const sectionData = settings[section];

    return sectionData;
  },
};

module.exports = settingsService;
