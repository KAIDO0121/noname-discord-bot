const { Product } = require("../../schema/product")
const { error, success } = require("../../utils/msgTemplate")
const { addOrUpdateUser } = require("../../utils/addOrUpdateUser")
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
  name: "put_product",
  description: "上架商品",
  options: [
    {
      type: 3,
      name: "item",
      description: "輸入商品id",
      required: true,
    },
    {
      type: 3,
      name: "price",
      description: "輸入商品金額",
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
      // 檢查背包是否有該商品
      const product = await Product.findOne({
        _id: args['item'],
        userId: interaction.user.id,
        isOnShop: false,
      })
      if (!product) {
        return error({
          msg: `查無商品`,
          interaction,
        })
      }

      // 變更商品上架狀態，價格
      product.price = args['price']
      product.isOnShop = true
      await product.save()

      return success({
        msg: `${product.name} 上架成功，價格：${product.price}`,
        interaction,
      })
    } catch (error) {
      console.log(error)
    }
  },
}
