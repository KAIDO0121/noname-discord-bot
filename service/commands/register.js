const { User } = require("../schema/user");
const { error, success } = require("../utils/msgTemplate");

module.exports = {
  name: "register",
  description: "Register your account for claiming whitelist",
  run: async (client, interaction) => {
    try {
      const user = await User.findOne({
        discordId: interaction.member.id,
      });

      if (!user) {
        const newUser = new User({
          createdAt: Date(),
          updatedAt: Date(),
          discordName: interaction.member.user.username,
          discordId: interaction.member.id,
          twitterAccount: "",
          twitterName: "",
          serverIds: [interaction.guildId],
        });
        await newUser.save();
        return interaction.channel.send({
          embeds: [
            success({
              msg: `${interaction.member.user.username} registered successfully`,
            }),
          ],
        });
      } else {
        if (user.serverIds.includes(interaction.guildId)) {
          return interaction.channel.send({
            embeds: [
              error({
                msg: `${interaction.member.user.username} already exists in this server`,
              }),
            ],
          });
        } else {
          user.serverIds.push(interaction.guildId);
          await newUser.save();
          return interaction.channel.send({
            embeds: [
              success({
                msg: `${interaction.member.user.username} registered successfully`,
              }),
            ],
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};
