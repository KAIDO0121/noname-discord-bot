const { MessageEmbed } = require("discord.js");

module.exports = {
  error: ({ msg, title = "Error", interaction }) => {
    const embed = new MessageEmbed()
      .setColor("#FF5733")
      .setTitle(title)
      .setDescription(msg);

    interaction
      .reply({ embeds: [embed], ephemeral: true })
      .then(() => console.log("Reply sent."))
      .catch(console.error);
  },
  success: ({ msg, title = "Success", interaction }) => {
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(title)
      .setDescription(msg);

    interaction
      .reply({ embeds: [embed], ephemeral: true })
      .then(() => console.log("Reply sent."))
      .catch(console.error);
  },
};
