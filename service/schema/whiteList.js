const mongoose = require("mongoose");

const whiteListSchema = new mongoose.Schema({
  name: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  users: [],
});

module.exports = {
  WhiteList: mongoose.model("WhiteList", whiteListSchema),
};
