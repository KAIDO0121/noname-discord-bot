const { User } = require("../schema/user");
const { Wallet } = require("../schema/wallet");
const { updateServerPoints } = require("../crud/updateServerPoints");
const { updatePointAdjustLog } = require("../crud/updatePointAdjustLog");
const {
  eventType,
  eventPoint,
  typeToPoint,
  noNameServerId,
} = require("../config");
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
    let user = await User.findOne({
      serverIds: interaction.guildId,
      discordId: interaction.user.id,
    });

    if (!user) {
      return error({
        msg: "You have to type `/register` before adding a wallet",
        interaction,
      });
    }
    if (!user?.walletAddress) {
      user = {
        ...user,
        walletAddress: {
          [interaction.guildId]: [],
        },
      };
    }
    if (
      user?.walletAddress[interaction.guildId]?.includes(args["wallet_address"])
    ) {
      return error({
        msg: `Address :${args["wallet_address"]} already exists`,
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
          { $push: { [s]: args["wallet_address"] } }
        );
        // for no name only

        if (interaction.guildId === noNameServerId) {
          const w = new Wallet({
            discordName: interaction.member.user.username,
            discordId: interaction.user.id,
            walletAddress: args["wallet_address"],
          });
          await w.save();
        }
      } catch (error) {
        console.log(error);
      }

      await updateServerPoints({
        serverId: interaction.guildId,
        userDiscordId: interaction.user.id,
        point: typeToPoint[eventType.add_wallet],
      });

      await updatePointAdjustLog({
        amount: typeToPoint[eventType.add_wallet],
        serverId: interaction.guildId,
        userDiscordId: interaction.user.id,
        eventType: eventType.add_wallet,
      });

      success({
        msg: `Address :${args["wallet_address"]} added successfully. You recieved : ${typeToPoint.add_wallet} points`,
        interaction,
      });
    }
  },
};
