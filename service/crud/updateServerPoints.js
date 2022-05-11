const { ServerPoint } = require("../schema/serverPoint");

module.exports = {
  updateServerPoints: async ({ point, serverId, userDiscordId }) => {
    try {
      let userTotalPoints = await ServerPoint.findOne({
        serverId,
        userDiscordId,
      });
      if (!userTotalPoints) {
        userTotalPoints = new ServerPoint({
          serverId,
          totalPoints: point,
          userDiscordId,
        });
      } else {
        userTotalPoints.totalPoints =
          Number(userTotalPoints.totalPoints) + Number(point);
      }
      await userTotalPoints.save();
    } catch (error) {
      console.log(error);
    }
  },
};
