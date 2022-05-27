const { User } = require("../schema/user")
const { ServerPoint } = require("../schema/serverPoint")
const { error, success } = require("../utils/msgTemplate")
const Mee6LevelsApi = require("mee6-levels-api")
const { updateServerPoints } = require("../crud/updateServerPoints")
const { updatePointAdjustLog } = require("../crud/updatePointAdjustLog")


module.exports = {
  name: "check_my_point",
  description: "Check my point at this server",
  run: async (client, interaction) => {
    try {
      const point = await ServerPoint.findOne({
        serverId: interaction.guildId,
        userDiscordId: interaction.user.id,
      })
      
      // const user = await User.findOne({
      //   serverIds: interaction.guildId,
      //   discordId: interaction.user.id,
      // });
      // let user = await User.findOne(
      //   {
      //     discordId: interaction.user.id,
      //     serverIds: interaction.guildId ,
      //   })

      // const guildId = interaction.guildId // or a Guild object with the id property
      // const userId = interaction.user.id // or a User object with the id property

      // const mee6UserData = await Mee6LevelsApi.getUserXp(guildId, userId)

      // if (!user.meelevels?.[interaction.guildId] || user.meelevels?.[interaction.guildId] < mee6UserData.level) {
      //   if (user.meelevels === undefined) {
      //     user.meelevels = {}
      //   };
      //   user.meelevels[interaction.guildId] = mee6UserData.level;
      //   console.log(user.meelevels, 1111)
      //   const res = await user.save();
      //   console.log(res)
      //   // const s = `mee6levels.${interaction.guildId}`
      //   // const res = await User.updateOne(
      //   //   {
      //   //     discordId: interaction.user.id,
      //   //     serverIds: { $in: [interaction.guildId] },
      //   //   },
      //   //   { $set: { mee6levels: {
      //   //     [interaction.guildId]: 123,
      //   //   } } },
      //   //   { upsert: true, new: true }
      //   // )

      //   // console.log(res)
      //   // await updateServerPoints({
      //   //   serverId: interaction.guildId,
      //   //   userDiscordId: interaction.user.id,
      //   //   point: 50,
      //   // });

      //   // await updatePointAdjustLog({
      //   //   amount: args['point'],
      //   //   serverId: interaction.guildId,
      //   //   userDiscordId: args["user"],
      //   //   eventType: eventType,
      //   // });
      // }



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
