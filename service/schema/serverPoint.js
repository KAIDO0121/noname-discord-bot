const mongoose = require("mongoose");

const serverPointSchema = new mongoose.Schema({
  serverId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  totalPoints: Number,
  userDiscordId: String,
});

module.exports = {
  ServerPoint: mongoose.model("ServerPoint", serverPointSchema),
};
