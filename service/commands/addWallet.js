const { User } = require("../schema/user");
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
    const user = await User.findOne({ serverIds: interaction.guildId });

    if (!user) {
      return interaction.channel.send({
        embeds: [error({ msg: `You have to register before adding a wallet` })],
      });
    }

    if (user.walletAddress.includes(args["wallet_address"])) {
      return interaction.channel.send({
        embeds: [
          error({ msg: `Address :${args["wallet_address"]} already exists` }),
        ],
      });
    } else {
      user.walletAddress.push(args["wallet_address"]);
      await user.save();
      return interaction.channel.send({
        embeds: [
          success({
            msg: `Address :${args["wallet_address"]} added successfully`,
          }),
        ],
      });
    }
  },
};
