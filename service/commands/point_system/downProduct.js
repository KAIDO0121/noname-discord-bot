const { Product } = require("../../schema/product")
const { error, success } = require("../../utils/msgTemplate")
const { addOrUpdateUser } = require("../../utils/addOrUpdateUser")
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
  name: "down_product",
  description: "下架商品",
  options: [
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
      // 檢查商店是否有該商品
      const product = await Product.findOne({
        _id: args['item'],
        userId: interaction.user.id,
        isOnShop: true,
      })
      if (!product) {
        return error({
          msg: `查無商品`,
          interaction,
        })
      }

      // 變更商品上架狀態，價格
      product.price = 0
      product.isOnShop = false
      await product.save()

      return success({
        msg: `${product.name}` + '下架成功，請查看自己的背包 `/my_item`',
        interaction,
      })
    } catch (error) {
      console.log(error)
    }
  },
}
