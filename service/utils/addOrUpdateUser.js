const { User } = require("../schema/user");

module.exports = {
  addOrUpdateUser: async (interaction) => {
    const user = await User.findOne({
      discordId: interaction.user.id,
    });
    
    if (!user) {
      const newUser = new User({
        createdAt: Date(),
        updatedAt: Date(),
        discordName: interaction.member.user.username + '#' + interaction.member.user.discriminator,
        discordId: interaction.user.id,
        twitterAccount: "",
        twitterName: "",
        serverIds: [interaction.guildId],
        walletAddress: {},
      });
      await newUser.save();
    } else {
      // user has serverId
      let name = interaction.member.nickname || interaction.member.user.username;
      if (user?.serverIds?.includes(interaction.guildId)) {
        user.discordName = name + '#' + interaction.member.user.discriminator
        await user.save();
      } else {
        // user didn't has serverId
        user.serverIds.push(interaction.guildId);
        user.discordName = name + '#' + interaction.member.user.discriminator
        await user.save();
      }
    }
  }
}
