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
});
module.exports = {
  Product: mongoose.model("Product", productSchema),
};
