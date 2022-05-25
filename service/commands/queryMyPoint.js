const { ServerPoint } = require("../schema/serverPoint");
const { error, success } = require("../utils/msgTemplate");

module.exports = {
  name: "check_my_point",
  description: "Check my point at this server",
  run: async (client, interaction) => {
    try {
      const point = await ServerPoint.findOne({
        serverId: interaction.guildId,
        userDiscordId: interaction.user.id,
      });

      console.log(point, 'point')

      if (!point) {
        return error({
          msg: `You didn't have any point at this server`,
          interaction,
        });
      }
      return success({
        msg: `You have ${point.totalPoints} points at this server`,
        interaction,
      });
    } catch (error) {}
  },
};
