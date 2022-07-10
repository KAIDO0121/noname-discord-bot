const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
  name: String,
  serverId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  levels: {},
  whiteLists: [],
  shopId: String,
  monitorChannelId: []
});

module.exports = {
  Server: mongoose.model("Server", serverSchema),
};
