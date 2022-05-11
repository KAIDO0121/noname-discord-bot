const { User } = require("../schema/user");
const { updateServerPoints } = require("../crud/updateServerPoints");
const { updatePointAdjustLog } = require("../crud/updatePointAdjustLog");
const { typeToPoint, eventType, eventPoint } = require("../config");
const { error, success } = require("../utils/msgTemplate");

module.exports = {
  name: "messageCreate",
  run: async (client, message) => {
    if (!message.interaction) return;

    const user = await User.findOne({
      serverIds: message.guildId,
      discordId: message.interaction.user.id,
    });

    if (!user) return;

    if (
      message.author.username === "Invite Tracker" &&
      message.interaction.commandName === "invites" &&
      message.interaction.user.id === user.discordId
    ) {
      const invites = +message.embeds[0].description
        .split(" ")
        .find((str) => str.startsWith("**"))
        .replace(/\D/g, "");

      if (user.invites === undefined) user.invites = {};
      const userInvites = user.invites[message.guildId] ?? 0;
      const newInvites = invites - userInvites;

      if (newInvites <= 0) return;

      await updateServerPoints({
        serverId: message.guildId,
        userDiscordId: user.discordId,
        point: typeToPoint.invite * newInvites,
      });

      await updatePointAdjustLog({
        amount: typeToPoint.invite * newInvites,
        serverId: message.guildId,
        userDiscordId: user.discordId,
        eventType: eventType.invite,
      });

      user.invites[message.guildId] = newInvites;

      try {
        await user.save();
        success({
          msg: `You recieved :${typeToPoint.invite * newInvites} points`,
          interaction: message,
        });
      } catch (error) {
        console.log(error);
      }
    }
  },
};
