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
      name: "user_id",
      description: "Input adjustment user id(複製ID)",
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

      const user = await User.findOne({
        serverIds: interaction.guildId,
        discordId: args["user_id"],
      });

      if (!user) {
        return error({
          msg: `User id : ${args["user_id"]} not found, most likely not registered or wrong user name`,
          interaction,
        });
      }

      await updateServerPoints({
        serverId: interaction.guildId,
        userDiscordId: interaction.user.id,
        point: typeToPoint[eventType],
      });

      await updatePointAdjustLog({
        amount: typeToPoint[eventType],
        serverId: interaction.guildId,
        userDiscordId: interaction.user.id,
        eventType: eventType,
      });

      return success({
        msg: `Successfully adjust: ${typeToPoint[eventType]} points for ${user.discordName}`,
        interaction,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
