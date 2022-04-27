const Discord = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "wl_add",
  description: "record your wallet address for claiming whitelist",
  options: [
    {
      type: "STRING",
      name: "wallet_address",
      description: "enter wallet address",
      required: true,
    },
  ],
  run: async (client, message, args) => {
    embed = discord.Embed(
      (title =
        "[sucess]\ntype `/wl_check` to check if your address is correct"),
      (color = 0x00ff00)
    );

    return message.channel.send({ embeds: [wordlist] });
  },
};
