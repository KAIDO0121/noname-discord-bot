const { User } = require("../schema/user");
const { updateServerPoints } = require("../crud/updateServerPoints")
const { updatePointAdjustLog } = require("../crud/updatePointAdjustLog")
const { eventType } = require("../config")
const { success } = require("../utils/msgTemplate")
const server = require('../schema/server')

module.exports = {
  transferPoint: async (interaction) => {
    const datas = interaction.customId.split('_')
    const serverId = datas[1]
    const userId = datas[2]
    const amount = datas[3]

    // 1 扣掉自己的金額
    // 2. 增加對方的金額
    await updateServerPoints({
      serverId,
      userDiscordId: userId,
      point: -1 * amount,
    })

    await updatePointAdjustLog({
      amount: -1 * amount,
      serverId,
      userDiscordId: userId,
      eventType: eventType.transfer_point,
    })

    await updateServerPoints({
      serverId,
      userDiscordId: interaction.user.id,
      point: amount,
    })

    await updatePointAdjustLog({
      amount,
      serverId,
      userDiscordId: interaction.user.id,
      eventType: eventType.receive_point,
    })

    // { amount: 50, eventType: "receive_point"}

    await interaction.message.delete();

    return success({
      msg: '收款成功！請回到伺服器輸入 `/check_my_point` 查看',
      interaction,
    })
  }
}
