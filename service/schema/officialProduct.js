const mongoose = require("mongoose");

const officialProductSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  name: String,
  roleId: String,
  price: Number,
  amount: Number,
  serverId: String,
});
module.exports = {
  OfficialProduct: mongoose.model("OfficialProduct", officialProductSchema),
};
