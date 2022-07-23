const { User } = require("../schema/user");
const { success, error } = require("./msgTemplate")
const { Product } = require("../schema/product")
const { ServerPoint } = require("../schema/serverPoint")
const { updateServerPoints } = require("../crud/updateServerPoints")
const { updatePointAdjustLog } = require("../crud/updatePointAdjustLog")
const { eventType } = require("../config")
const _ = require('lodash')
const { addOrUpdateUser } = require("./addOrUpdateUser")
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
  buyProduct: async (client, interaction, args) => {
    try {
      await addOrUpdateUser(interaction)

      if (!ObjectId.isValid(args['item'])) {
        return error({
          msg: `商品id錯誤`,
          interaction,
        })
      }

      // 判斷是否有此商品
      const product = await Product.findOne({
        _id: args['item'],
        isOnShop: true,
      })

      if (!product) {
        return error({
          msg: `查無此商品`,
          interaction,
        })
      }

      // 判斷此商品為他人的商品並非自己的商品
      if (product.userId === interaction.user.id) {
        return error({
          msg: `此商品是你的，不用另外購買`,
          interaction,
        })
      }

      // 判斷使用者帳戶是否足夠購買進貨數量的金額
      const point = await ServerPoint.findOne({
        serverId: interaction.guildId,
        userDiscordId: interaction.user.id,
      })

      if (!point) {
        return error({
          msg: `進貨總金額大於我的餘額`,
          interaction,
        });
      }

      // 價格不能為負數
      if (product.price <= 0) {
        return error({
          msg: `商品價格不能為負數或零`,
          interaction,
        })
      }

      if (product.price > point?.totalPoints) {
        return error({
          msg: `商品金額大於我的餘額`,
          interaction,
        })
      }

      const seller = await User.findOne({
        discordId: product.userId,
      })

      // 購買
      // 1 扣掉自己的金額
      // 2. 增加對方的金額
      // 3 轉移 product
      await updateServerPoints({
        serverId: interaction.guildId,
        userDiscordId: interaction.user.id,
        point: -1 * product.price,
      })

      await updatePointAdjustLog({
        amount: -1 * product.price,
        serverId: interaction.guildId,
        userDiscordId: interaction.user.id,
        eventType: eventType.buy_product,
      })

      await updateServerPoints({
        serverId: interaction.guildId,
        userDiscordId: seller.discordId,
        point: 1 * product.price,
      })

      await updatePointAdjustLog({
        amount: 1 * product.price,
        serverId: interaction.guildId,
        userDiscordId: seller.discordId,
        eventType: eventType.sell_product,
      })

      product.price = 0
      product.isOnShop = false
      product.isOnMarket = false
      product.userId = interaction.user.id
      await product.save()

      return success({
        msg: `${product.name}` + ` 購買成功！可使用` + '`/my_item` 查看自己的背包',
        interaction,
      })


    } catch (error) {
      console.log(error)
    }
  },
}
