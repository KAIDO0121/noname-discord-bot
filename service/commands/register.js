const { User } = require("../schema/user");
const { error, success } = require("../utils/msgTemplate");

module.exports = {
  name: "register",
  description: "Register your account for claiming whitelist",
  run: async (client, interaction) => {
    try {
      const user = await User.findOne({
        discordId: interaction.user.id,
      });

      if (!user) {
        const newUser = new User({
          createdAt: Date(),
          updatedAt: Date(),
          discordName: interaction.member.user.username,
          discordId: interaction.user.id,
          twitterAccount: "",
          twitterName: "",
          serverIds: [interaction.guildId],
          walletAddress: {},
        });
        await newUser.save();
        return success({
          msg: `${interaction.member.user.username} registered successfully`,
          interaction,
        });
      } else {
        if (user?.serverIds?.includes(interaction.guildId)) {
          return error({
            msg: `${interaction.member.user.username} already exists in this server`,
            interaction,
          });
        } else {
          user.serverIds.push(interaction.guildId);
          await user.save();
          return success({
            msg: `${interaction.member.user.username} registered successfully`,
            interaction,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};
