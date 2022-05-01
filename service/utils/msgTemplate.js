const { MessageEmbed } = require("discord.js");

module.exports = {
  error: ({ msg, title = "Error" }) => {
    return new MessageEmbed()
      .setColor("#FF5733")
      .setTitle(title)
      .setDescription(msg);
  },
  success: ({ msg, title = "Success" }) => {
    return new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(title)
      .setDescription(msg);
  },
};
