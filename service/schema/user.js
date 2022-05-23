const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  walletAddress: {},
  invites: {},
  discordName: String,
  discordId: String,
  twitterAccount: String,
  twitterName: String,
  mee6Points: {},
  serverIds: [],
});
module.exports = {
  User: mongoose.model("User", userSchema),
};
