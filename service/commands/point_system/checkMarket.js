const { User } = require("../../schema/user")
const { OfficialShop } = require("../../schema/officialShop")
const { OfficialProduct } = require("../../schema/officialProduct")
const { Product } = require("../../schema/product")

const { error, shopMsg } = require("../../utils/msgTemplate")
const { addOrUpdateUser } = require("../../utils/addOrUpdateUser")
const _ = require('lodash')

module.exports = {
  name: "check_market",
  description: "呼叫拍賣所",
  run: async (client, interaction, args) => {
    await addOrUpdateUser(interaction)

    const products = await Product.find({
      serverId: interaction.guildId,
      isOnShop: true,
      isOnMarket: true,
    })

    if (!products || products.length == 0) {
      return error({
        msg: `目前拍賣所無商品販售`,
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
        is_official: 2, // 0 官方, 1 使用者, 2 拍賣所
        user_name: '',
        hint: '你可以使用 /buy [商品 id] 來購買商品\n\n',
        productChunk: [
          ..._.chunk(message_products, 5)
        ],
        interaction,
      })

    }
  },
}
