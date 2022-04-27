const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  user_id: mongoose.ObjectId,
  created_at: Date.now,
  updated_at: Date.now,
  wallet_address: {
    eth: 1234,
    btc: 46465,
  },
  invites: {
    regular: 10,
    left: 3,
    fake: 1,
    bonus: 2,
  },
  discord_account: String,
  discord_name: String,
  discord_id: "46456546",
  twitter_account: "intheblackworld@gmail.com",
  twitter_name: "intheblackworld@gmail.com",
  mee6_points: {
    yolo_cat_server_id: 3000,
    fomo_dog_server_id: 2000,
  },
});
