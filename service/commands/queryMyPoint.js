// const { User } = require("../schema/user")
const { ServerPoint } = require("../schema/serverPoint")
const { error, success } = require("../utils/msgTemplate")
const { addOrUpdateUser } = require("../utils/addOrUpdateUser")
// const Mee6LevelsApi = require("mee6-levels-api")
// const { updateServerPoints } = require("../crud/updateServerPoints")
// const { updatePointAdjustLog } = require("../crud/updatePointAdjustLog")
const { check_update_point } = require("../utils/checkMee6Level")


module.exports = {
  name: "check_my_point",
  description: "Check my point at this server",
  run: async (client, interaction) => {
    try {
      const point = await ServerPoint.findOne({
        serverId: interaction.guildId,
        userDiscordId: interaction.user.id,
      })

      await addOrUpdateUser(interaction)

      await check_update_point(client, interaction)

      if (!point) {
        return error({
          msg: `You didn't have any point at this server`,
          interaction,
        })
      }
      return success({
        msg: `You have ${point.totalPoints} points at this server`,
        interaction,
      })
    } catch (error) {
      console.log(error)
    }
  },
}
