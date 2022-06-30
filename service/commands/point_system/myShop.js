const { Product } = require("../../schema/product")
const { error, shopMsg } = require("../../utils/msgTemplate")
const { addOrUpdateUser } = require("../../utils/addOrUpdateUser")
const { Collector } = require('discord.js')
const _ = require('lodash')

module.exports = {
  name: "my_shop",
  description: "查看自己的商店",
  run: async (client, interaction, args) => {
    try {
      await addOrUpdateUser(interaction)
      // 判斷背包是否有商品
      // 顯示背包中的商品
      const products = await Product.find({
        userId: interaction.user.id,
        isOnShop: true,
        serverId: interaction.guildId,
      })
      if (!products) {
        return error({
          msg: `目前商店尚無商品`,
          interaction,
        })
      } else {
        const message_products = products.map((item, i) => ({
          name: item.name,
          price: item.price,
          description: '',
          amount: 1,
          id: item._id
        }))
        return shopMsg({
          is_official: false,
          user_name: interaction.user.username,
          productChunk: [
            ..._.chunk(message_products, 1)
          ],
          interaction,
        })

      }
    } catch (error) {
      console.log(error)
    }
  },
}
