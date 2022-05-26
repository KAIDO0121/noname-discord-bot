const { MessageEmbed } = require("discord.js");

module.exports = {
  error: async ({ msg, title = "Error", interaction }) => {
    const embed = new MessageEmbed()
      .setColor("#FF5733")
      .setTitle(title)
      .setDescription(msg);

    await interaction
      .reply({ embeds: [embed], ephemeral: true })
      .then(() => console.log("Reply sent."))
      .catch(console.error);
  },
  success: async ({ msg, title = "Success", interaction }) => {
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(title)
      .setDescription(msg);

    await interaction
      .reply({ embeds: [embed], ephemeral: true })
      .then(() => console.log("Reply sent."))
      .catch(console.error);
  },
  multiFieldsMsg: async ({ interaction, msgFields }) => {
    const embed = {
      color: "#0099ff",
      fields: msgFields,
    };
    try {
      await interaction
        .reply({ embeds: [embed], ephemeral: true })
        .then(() => console.log("Reply sent."))
        .catch(console.error);
    } catch (e) {
      console.log(e)
    }
  },
};
