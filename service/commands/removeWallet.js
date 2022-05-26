const { User } = require("../schema/user");
const { Wallet } = require("../schema/wallet");
const { updateServerPoints } = require("../crud/updateServerPoints");
const { updatePointAdjustLog } = require("../crud/updatePointAdjustLog");
const { eventType, eventPoint, typeToPoint } = require("../config");
const { error, success } = require("../utils/msgTemplate");

module.exports = {
  name: "remove_wallet",
  description: "Remove a wallet address",
  options: [
    {
      type: 3,
      name: "wallet_address",
      description: "Enter the address you want to remove",
      required: true,
    },
  ],

  run: async (client, interaction, args) => {
    const user = await User.findOne({
      serverIds: interaction.guildId,
      discordId: interaction.user.id,
    });

    if (!user) {
      return error({
        msg: `You have to register before removing a wallet`,
        interaction,
      });
    }
    if (!user?.walletAddress) {
      return error({
        msg: `Address :${args["wallet_address"]} doesn't exist`,
        interaction,
      });
    }
    if (
      !user?.walletAddress[interaction.guildId]?.includes(
        args["wallet_address"]
      )
    ) {
      return error({
        msg: `Address :${args["wallet_address"]} doesn't exist`,
        interaction,
      });
    } else {
      try {
        const s = `walletAddress.${interaction.guildId}`;
        const user = await User.updateOne(
          {
            serverIds: interaction.guildId,
            discordId: interaction.user.id,
          },
          { $pullAll: { [s]: [args["wallet_address"]] } }
        );
        // for no name only
        // if (interaction.guildId === noNameServerId) {
        //   await Wallet.updateOne(
        //     { walletAddress: args["wallet_address"] },
        //     { $set: { walletAddress: null } }
        //   );
        // }
      } catch (error) {
        console.log(error);
      }

      await updateServerPoints({
        serverId: interaction.guildId,
        userDiscordId: interaction.user.id,
        point: typeToPoint[eventType.remove_wallet],
      });

      await updatePointAdjustLog({
        amount: typeToPoint[eventType.remove_wallet],
        serverId: interaction.guildId,
        userDiscordId: interaction.user.id,
        eventType: eventType.remove_wallet,
      });

      success({
        msg: `Address :${args["wallet_address"]} removed successfully. You lost : ${typeToPoint.add_wallet} points`,
        interaction,
      });
    }
  },
};
