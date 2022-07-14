const { Product } = require("../../schema/product")
const { error, bagMsg } = require("../../utils/msgTemplate")
const { addOrUpdateUser } = require("../../utils/addOrUpdateUser")

module.exports = {
  name: "my_item",
  description: "查看自己的背包",
  run: async (client, interaction, args) => {
    try {
      await addOrUpdateUser(interaction)
      // 判斷背包是否有商品
      // 顯示背包中的商品
      const products = await Product.find({
        userId: interaction.user.id,
        isOnShop: false,
        isOnMarket: [false, null],
        serverId: interaction.guildId,
      })
      if (!products || products.length == 0) {
        return error({
          msg: `目前背包尚無商品`,
          interaction,
        })
      } else {
        return bagMsg({
          user_name: interaction.user.username,
          products,
          interaction,
        })

      }
    } catch (error) {
      console.log(error)
    }
  },
}
