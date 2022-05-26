const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  walletAddress: String,
  discordName: String,
  discordId: String,
});
module.exports = {
  Wallet: mongoose.model("Wallet", walletSchema),
};
