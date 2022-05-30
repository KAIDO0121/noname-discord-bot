const { User } = require("../schema/user")
const Mee6LevelsApi = require("mee6-levels-api")
const { updateServerPoints } = require("../crud/updateServerPoints")
const { updatePointAdjustLog } = require("../crud/updatePointAdjustLog")


module.exports = {
  check_update_point: async (client, interaction, user_id) => {
    let user = await User.findOne(
      {
        discordId: user_id || interaction.user.id,
        serverIds: interaction.guildId,
      })

    const guildId = interaction.guildId // or a Guild object with the id property
    const userId = interaction.user.id // or a User object with the id property

    const mee6UserData = await Mee6LevelsApi.getUserXp(guildId, userId)
    let level = 0
    if (mee6UserData) {
      level = mee6UserData.level
    }

    if (!user.mee6Level?.[interaction.guildId] || user.mee6Level?.[interaction.guildId] < level) {
      if (user.mee6Level === undefined) {
        user.mee6Level = {}
      };

      user.mee6Level[interaction.guildId] = level
      await user.save()
      
      if (level > 0 && level % 5 == 0) {
        console.log('need add point!')
        await updateServerPoints({
          serverId: interaction.guildId,
          userDiscordId: interaction.user.id,
          point: 50,
        })

        await updatePointAdjustLog({
          amount: 50,
          serverId: interaction.guildId,
          userDiscordId: userId,
          eventType: 'mee6',
        })
      } else {
        console.log('no need')
      }
      // const s = `mee6levels.${interaction.guildId}`
      // const res = await User.updateOne(
      //   {
      //     discordId: interaction.user.id,
      //     serverIds: { $in: [interaction.guildId] },
      //   },
      //   { $set: { mee6levels: {
      //     [interaction.guildId]: 123,
      //   } } },
      //   { upsert: true, new: true }
      // )

      // console.log(res)

    }
  }
};
