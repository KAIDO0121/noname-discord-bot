const { PointAdjustLog } = require("../schema/pointAdjustLog");

module.exports = {
  updatePointAdjustLog: async ({
    amount,
    serverId,
    userDiscordId,
    eventType,
  }) => {
    try {
      const pointAdjustLog = new PointAdjustLog({
        serverId,
        userDiscordId,
        eventType,
        amount,
      });
      await pointAdjustLog.save();
    } catch (error) {
      console.log(error);
    }
  },
};
