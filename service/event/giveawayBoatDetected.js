const { User } = require("../schema/user")
const { updateServerPoints } = require("../crud/updateServerPoints")
const { updatePointAdjustLog } = require("../crud/updatePointAdjustLog")
const { typeToPoint, eventType, eventPoint } = require("../config")
const { error, success } = require("../utils/msgTemplate")

module.exports = {
  name: "messageCreate",
  run: async (client, message) => {
    // if (!message.interaction) return;

    // console.log(message.author, 'message.author')
    // console.log(message.embeds[0], 'message.embeds[0]')
    if (message.author.username != 'Giveaway Boat') return

    let msg = message.embeds[0].description
    console.log(message.embeds[0].description, 'message.embeds[0].description')
    let won_list = msg.split('won the giveaway of')[0]?.replace("<@", "")?.replace(">", "")?.replace(" ", "")?.split(",")
    let reward = msg.split('won the giveaway of')[1]?.split(']')[0]?.replace("[", "")?.split("：")[1]
    console.log(won_list, 'won_list')
    console.log(reward, 'reward')

    if (
      won_list.length > 0 && reward &&
      message.author.username == 'Giveaway Boat' &&
      message.embeds[0].description.includes('g.reroll')
    ) {
      await Promise.all(
        won_list.map(async user_id => {
          try {
            const user = await User.findOne({
              serverIds: message.guildId,
              discordId: user_id,
            })
    
            console.log(user, 'user')
    
            if (!user) return
    
            await updateServerPoints({
              serverId: message.guildId,
              userDiscordId: user.discordId,
              point: reward,
            })
    
            await updatePointAdjustLog({
              amount: reward,
              serverId: message.guildId,
              userDiscordId: user.discordId,
              eventType: eventType.giveaway,
            })
          } catch (error) {
            console.log(error)
          }
        })
      )
    }
  }
}
