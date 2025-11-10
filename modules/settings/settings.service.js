const _ = require("lodash");
const Settings = require("../../models/Settings");
const throwError = require("../../middlewares/throw-error");

const settingsService = {
  /**
   * Update Settings
   * - If no settings found, it creates one
   * - Performs deep merge update
   */
  async update(data, section) {    
    let settings = await Settings.findOne();
    

    if (!settings) {
      settings = await Settings.create({});
    }

    const updatedSettings = await Settings.findOneAndUpdate(
      { _id: settings._id },
      { $set: data },
      { new: true }
    ).populate([
      "general.logo",
      "general.homepageSlider",
      "default-seo.ogImage",
      "default-seo.twitterImage",
      "about.image",
    ]);

    return updatedSettings[section];
  },

  /**
   * Get a specific section of Settings
   * @param {string} section
   */
  async getSection(section) {
    const validSections = ["default-seo", "general", "faq", "terms", "about"];

    if (!validSections.includes(section)) {
      throwError("تنظیماتی یافت نشد.", 404);
    }

    const settings = await Settings.findOne()
      .populate(
        "general.logo general.homepageSlider default-seo.ogImage default-seo.twitterImage about.image"
      )
      .lean();

    if (!settings) {
      throwError("تنظیماتی یافت نشد.");
    }

    const sectionData = settings[section];

    return sectionData;
  },
};

module.exports = settingsService;
