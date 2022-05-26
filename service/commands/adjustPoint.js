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
      type: 6,
      name: "user",
      description: "Input adjustment user",
      required: true,
    },
    {
      type: 3,
      name: "event_type",
      description: "Select adjustment type",
      required: true,
      choices: eventPoint,
    },
    {
      type: 3,
      name: "point",
      description: "How many point you want to adjust",
      required: true,
    },
  ],
  run: async (client, interaction, args) => {
    try {
      const eventType = args["event_type"];

      const user = await User.findOne({
        serverIds: interaction.guildId,
        discordId: args["user"],
      });

      if (!user) {
        return error({
          msg: `User id : ${args["user"]} not found, most likely not registered or wrong user name`,
          interaction,
        });
      }

      await updateServerPoints({
        serverId: interaction.guildId,
        userDiscordId: args["user"],
        point: args['point'],
      });

      await updatePointAdjustLog({
        amount: args['point'],
        serverId: interaction.guildId,
        userDiscordId: args["user"],
        eventType: eventType,
      });

      return success({
        msg: `Successfully adjust: ${args['point']} points for ${user.discordName}`,
        interaction,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
