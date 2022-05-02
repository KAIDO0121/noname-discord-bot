const mongoose = require("mongoose");

const pointRecordSchema = new mongoose.Schema({
  serverId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  eventType: String,
  amount: Number,
  userDiscordId: String,
});

module.exports = {
  PointRecord: mongoose.model("PointRecord", pointRecordSchema),
};
