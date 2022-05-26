const { ServerPoint } = require("../schema/serverPoint");
const { User } = require("../schema/user");
const { error, success } = require("../utils/msgTemplate");

module.exports = {
  name: "check_user_point",
  description: "Check user points at this server",
  options: [
    {
      type: 6,
      name: "user",
      description: "Enter the user id you want to check(複製ID)",
      required: true,
    },
  ],
  run: async (client, interaction, args) => {
    try {
      const point = await ServerPoint.findOne({
        serverId: interaction.guildId,
        userDiscordId: args["user"],
      });

      const user = await User.findOne({
        serverIds: interaction.guildId,
        discordId: args["user"],
      });

      if (!user) {
        return error({
          msg: `This User didn't regist yet`,
          interaction,
        });
      }

      if (!point) {
        return error({
          msg: `User : ${user.discordName} didn't have any point at this server`,
          interaction,
        });
      }
      return success({
        msg: `User : ${user.discordName} have ${point.totalPoints} points at this server`,
        interaction,
      });
    } catch (error) {
      console.log(error)
    }
  },
};
