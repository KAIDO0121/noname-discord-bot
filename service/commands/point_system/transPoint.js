const { User } = require("../../schema/user")
const { error, success } = require("../../utils/msgTemplate")
const { Product } = require("../../schema/product")
const { ServerPoint } = require("../../schema/serverPoint")
const { updateServerPoints } = require("../../crud/updateServerPoints")
const { updatePointAdjustLog } = require("../../crud/updatePointAdjustLog")
const { eventType } = require("../../config")
const _ = require('lodash')
const { addOrUpdateUser } = require("../../utils/addOrUpdateUser")
const { MessageActionRow, MessageButton } = require('discord.js')




const { Server } = require("../../schema/server")
const user = require('../../schema/user')

module.exports = {
  name: "trans_point",
  description: "轉帳給指定用戶",
  options: [
    {
      type: 6,
      name: "user_to_transfer",
      description: "欲轉帳的用戶",
      required: true,
    },
    {
      type: 3,
      name: "amount",
      description: "輸入轉帳金額",
      required: true,
    },
  ],
  run: async (client, interaction, args) => {
    try {
      await addOrUpdateUser(interaction)

      // 檢查帳戶餘額是否足夠
      const point = await ServerPoint.findOne({
        serverId: interaction.guildId,
        userDiscordId: interaction.user.id,
      })

      if (args['amount'] > point) {
        return error({
          msg: `帳戶餘額不足`,
          interaction,
        })
      }

      // 檢查轉帳對方用戶是否存在
      const to = await User.findOne({
        discordId: args['user_to_transfer'],
      })

      if (!to) {
        return error({
          msg: `該用戶尚無資料，請確認對方已使用積分系統`,
          interaction,
        })
      }

      // 欲轉帳的用戶非自己
      const user = await User.findOne({
        discordId: interaction.user.id,
      })
      // if (interaction.user.id === args['user_to_transfer']) {
      //   return error({
      //     msg: `轉帳用戶請勿輸入自己的帳號`,
      //     interaction,
      //   })
      // }
      // DM 訊息
      const sender = await client.users.fetch(args['user_to_transfer'])
      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId(`transPoint_${interaction.guildId}_${interaction.user.id}_${args['amount']}`)
            .setLabel('Confirm')
            .setStyle('SUCCESS'),
        )
      const messageContent = `Hi! ${user.discordName} 想轉帳 ${args['amount']} 金額給您，請點擊下方按鈕確認(限時5分鐘)`

      sender.send({ content: messageContent, components: [row] }).catch(e => {
        if (e.code === 50007 || e.code === 40060) {
          return error({
            msg: `無法私訊轉帳請求給對方，請確認以下事項\n1. 對方跟你在同一個伺服器\n2.對方有開啟DM功能(允許來自伺服器成員的私人訊息)\n3.對方沒有封鎖機器人`,
            interaction,
          })
        }
      }).then((res) => {
        setTimeout(() => {
          const disable_row = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId(`transPoint_${interaction.guildId}_${interaction.user.id}_${args['amount']}`)
                .setLabel('Confirm')
                .setStyle('SUCCESS')
                .setDisabled(true)
            )
          res.edit({
            content: '已超過轉帳同意時限5分鐘',
            components: [disable_row],
          })
        }, 1000 * 60 * 5)
        return success({
          msg: `已私訊對方轉帳請求，等待對方點擊確認中`,
          interaction,
        })
      })
    } catch (error) {
      console.log(error)
    }
  },
}
