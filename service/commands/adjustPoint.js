const { User } = require("../schema/user");
const { updateServerPoints } = require("../crud/updateServerPoints");
const { updatePointAdjustLog } = require("../crud/updatePointAdjustLog");
const { error, success } = require("../utils/msgTemplate");
const { eventPoint, typeToPoint } = require("../config");

module.exports = {
  name: "adjust_point",
  description: "Adjust point for user",
  options: [
    {
      type: 3,
      name: "user_name",
      description: "Input adjustment user name",
      required: true,
    },
    {
      type: 3,
      name: "event_type",
      description: "Select adjustment type",
      required: true,
      choices: eventPoint,
    },
  ],
  run: async (client, interaction, args) => {
    try {
      const eventType = args["event_type"];
      const user = await User.findOne({ discordName: args["user_name"] });
      if (!user) {
        return interaction.channel.send({
          embeds: [error({ msg: `User :${args["user_name"]} not found` })],
        });
      }

      await updateServerPoints({
        serverId: interaction.guildId,
        userDiscordId: interaction.member.id,
        point: typeToPoint[eventType],
      });

      await updatePointAdjustLog({
        amount: typeToPoint[eventType],
        serverId: interaction.guildId,
        userDiscordId: interaction.member.id,
        eventType: eventType,
      });

      return interaction.channel.send({
        embeds: [
          success({
            msg: `Successfully adjust: ${typeToPoint[eventType]} points for ${args["user_name"]}`,
          }),
        ],
      });
    } catch (error) {
      console.log(error);
    }
  },
};
