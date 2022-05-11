const { ServerPoint } = require("../schema/serverPoint");
const { error, success } = require("../utils/msgTemplate");

module.exports = {
  name: "check_user_point",
  description: "Check user points at this server",
  options: [
    {
      type: 3,
      name: "user_name",
      description: "Enter the user name you want to check",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    try {
      const point = await ServerPoint.findOne({
        serverId: interaction.guildId,
        userDiscordId: args["user_name"],
      });

      if (!point) {
        return error({
          msg: `User : ${args["user_name"]} didn't have any point at this server`,
          interaction,
        });
      }
      return success({
        msg: `User : ${args["user_name"]} have ${point.totalPoints} points at this server`,
        interaction,
      });
    } catch (error) {}
  },
};
