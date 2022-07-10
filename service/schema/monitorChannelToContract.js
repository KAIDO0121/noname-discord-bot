const mongoose = require("mongoose");

const monitorChannelToContractSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  channelIdToBlockNumber: {},
  serverId: String
});
module.exports = {
  MonitorChannelToContract: mongoose.model("MonitorChannelToContract", monitorChannelToContractSchema),
};
