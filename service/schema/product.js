const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  name: String,
  roleId: String,
  price: Number,
  serverId: String,
  userId: String,
  isOnShop: Boolean,
  isOnMarket: Boolean,
  // isOnShop, isOnMarket 同時為 true, 代表在交易所
  // isOnShop: true, isOnMarket: false, 代表在個人商店
  // isOnshop: false, isOnMarket: false, 代表在背包
});
module.exports = {
  Product: mongoose.model("Product", productSchema),
};
