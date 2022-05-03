const mongoose = require("mongoose");

const eventTypeSchema = new mongoose.Schema({
  serverId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  label: String,
  description: String,
  value: Number,
});

module.exports = {
  EventType: mongoose.model("EventType", eventTypeSchema),
};
