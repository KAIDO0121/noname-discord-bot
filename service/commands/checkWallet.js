const { User } = require("../schema/user");
const { error, multiFieldsMsg, success } = require("../utils/msgTemplate");

module.exports = {
  name: "check_wallet",
  description: "Check all added wallet addresses",
  run: async (client, interaction, args) => {
    const user = await User.findOne({
      serverIds: interaction.guildId,
      discordId: interaction.user.id,
    });

    if (!user) {
      return error({
        msg: `You have to register before checking the wallet addresses`,
        interaction,
      });
    }
    if (!user.walletAddress) {
      return success({
        msg: `You haven't add any address yet`,
        interaction,
      });
    }
    if (!user?.walletAddress[interaction.guildId]?.length) {
      return success({
        msg: `You haven't add any address yet in this server`,
        interaction,
      });
    }
    const address = user.walletAddress[interaction.guildId].map((addr, i) => ({
      name: `Wallet address-${i + 1}`,
      value: `${addr}`,
      inline: true,
    }));

    return multiFieldsMsg({
      msgFields: address,
      interaction,
    });
  },
};
