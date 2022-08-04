const { Product } = require("../../schema/product")
const { error, success } = require("../../utils/msgTemplate")
const { addOrUpdateUser } = require("../../utils/addOrUpdateUser")
const ObjectId = require('mongoose').Types.ObjectId;
const { isNum } = require('../../utils/validate')

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
    {
      type: 5,
      name: "is_own_shop",
      description: "True: 上架到自己的商店; False: 上架到拍賣所",
      required: true,
    },
  ],
  run: async (client, interaction, args) => {
    try {
      await addOrUpdateUser(interaction)
      
      if (!ObjectId.isValid(args['item'])) {
        return error({
          msg: `商品id錯誤，上架失敗`,
          interaction,
        })
      }
      // 檢查背包是否有該商品
      const product = await Product.findOne({
        _id: args['item'],
        userId: interaction.user.id,
        isOnShop: false,
        isOnMarket: [false, null],
      })
      if (!product) {
        return error({
          msg: `背包無此商品，上架失敗，請注意商品id`,
          interaction,
        })
      }

      if (!isNum(args['price'])) {
        return error({
          msg: `商品金額必須為整數`,
          interaction,
        })
      }

      // 價格不能為負數
      if (Number(args['price']) <= 0) {
        return error({
          msg: `商品價格不能為負數或零`,
          interaction,
        })
      }

      product.price = args['price']
      
      if (args['is_own_shop']) {
        // 變更商品上架狀態，價格
        product.isOnShop = true
        product.isOnMarket = false
      } else {
        product.isOnShop = true
        product.isOnMarket = true
      }

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
