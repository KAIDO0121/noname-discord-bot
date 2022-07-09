// const { User } = require("../schema/user")
const { ServerPoint } = require("../schema/serverPoint")
const { error, success } = require("../utils/msgTemplate")
const { addOrUpdateUser } = require("../utils/addOrUpdateUser")

const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
// const Mee6LevelsApi = require("mee6-levels-api")
// const { updateServerPoints } = require("../crud/updateServerPoints")
// const { updatePointAdjustLog } = require("../crud/updatePointAdjustLog")
// const { check_update_point } = require("../utils/checkMee6Level")


module.exports = {
  name: "set_pick_role",
  description: "MOD 設置陣營",
  options: [
    {
      type: 3,
      name: "channel",
      description: "想要發送此訊息至哪一個頻道",
      required: true,
    },
  ],
  run: async (client, interaction) => {
    try {
      const getRow = () => {
        const row = new MessageActionRow()
        row.addComponents(
          new MessageButton()
            .setCustomId(`goblins`)
            .setStyle('SUCCESS')
            .setLabel('哥布林 Goblins')
            .setEmoji('👽')
        )
        row.addComponents(
          new MessageButton()
            .setCustomId(`orcs`)
            .setStyle('SUCCESS')
            .setLabel('半獸人 Orcs')
            .setEmoji('☠')
        )
  
        return row
      }
      const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle('選擇陣營')
      .setDescription(`Unknown受到創子金雨的影響
      鄰近的奇幻宇宙入侵了我們的意識
      請選擇要加入的陣營勢力，為部落而戰
      Unknown is influenced by creative particle golden rain,
      a neighboring fantasy universe has invaded our consciousness.
      Please select the faction then fight for tribe.
      
      (哥布林 **Goblins**) (半獸人 **Orcs**)`)
      await client.channels.cache.get(args['channel']).send({ embeds: [embed],components: [getRow()], })
    await interaction
      .reply('設置成功')
      .then(() => console.log("Reply sent."))
      .catch(console.error)
    } catch (error) {
      console.log(error)
    }
  },
}
