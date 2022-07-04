const { User } = require("../../schema/user");
const { error, success } = require("../../utils/msgTemplate")
const { Product } = require("../../schema/product")
const { ServerPoint } = require("../../schema/serverPoint")
const { updateServerPoints } = require("../../crud/updateServerPoints")
const { updatePointAdjustLog } = require("../../crud/updatePointAdjustLog")
const { eventType } = require("../../config")
const _ = require('lodash')
const { addOrUpdateUser } = require("../../utils/addOrUpdateUser")
const ObjectId = require('mongoose').Types.ObjectId;



const { Server } = require("../../schema/server")
const user = require('../../schema/user')

module.exports = {
  name: "give_item",
  description: "直接贈予商品",
  options: [
    {
      type: 6,
      name: "user",
      description: "選擇贈予者",
    },
    {
      type: 3,
      name: "item",
      description: "輸入商品id",
      required: true,
    },
  ],
  run: async (client, interaction, args) => {
    try {
      await addOrUpdateUser(interaction)

      if (!ObjectId.isValid(args['item'])) {
        return error({
          msg: `商品id錯誤`,
          interaction,
        })
      }

      // 判斷是否持有此商品
      const product = await Product.findOne({
        _id: args['item'],
        userId: interaction.user.id,
      })

      if (!product) {
        return error({
          msg: `查無此商品或您非持有者`,
          interaction,
        })
      }

      const user = await User.findOne({
        serverIds: interaction.guildId,
        discordId: args["user"],
      });

      // 判斷贈予的使用者跟自己不一樣
      if (product.userId === interaction.user.id) {
        return error({
          msg: `請指定正確的贈予者`,
          interaction,
        })
      }

      // 判斷使用者帳戶是否足夠購買進貨數量的金額
      const point = await ServerPoint.findOne({
        serverId: interaction.guildId,
        userDiscordId: interaction.user.id,
      })

      product.price = 0
      product.isOnShop = false
      product.userId = args['user']
      await product.save()

      return success({
        msg: `${product.name}` + ` 贈予成功！可請對方使用` + '`/my_item` 查看自己的背包',
        interaction,
      })


    } catch (error) {
      console.log(error)
    }
  },
}
