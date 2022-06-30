const mongoose = require("mongoose");

const officialShopSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  serverId: String,
  officialProductIds: [],
});
module.exports = {
  OfficialShop: mongoose.model("OfficialShop", officialShopSchema),
};
