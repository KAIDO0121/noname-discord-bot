const { User } = require("../schema/user");
const { updateServerPoints } = require("../crud/updateServerPoints");
const { updatePointAdjustLog } = require("../crud/updatePointAdjustLog");
const { eventType, eventPoint, typeToPoint } = require("../config");
const { error, success } = require("../utils/msgTemplate");

module.exports = {
  name: "add_wallet",
  description: "Add wallet address",
  options: [
    {
      type: 3,
      name: "wallet_address",
      description: "Register your address for claiming whitelist",
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
        msg: `You have to register before adding a wallet`,
        interaction,
      });
    }

    if (user.walletAddress.includes(args["wallet_address"])) {
      return error({
        msg: `Address :${args["wallet_address"]} already exists`,
        interaction,
      });
    } else {
      user.walletAddress.push(args["wallet_address"]);
      await user.save();

      await updateServerPoints({
        serverId: interaction.guildId,
        userDiscordId: interaction.user.id,
        point: eventPoint.add_wallet,
      });

      await updatePointAdjustLog({
        amount: eventPoint.add_wallet,
        serverId: interaction.guildId,
        userDiscordId: interaction.user.id,
        eventType: eventType.add_wallet,
      });

      success({
        msg: `Address :${args["wallet_address"]} added successfully`,
        interaction,
      });
      success({
        msg: `You recieved :${typeToPoint.add_wallet} points`,
        interaction,
      });
    }
  },
};
