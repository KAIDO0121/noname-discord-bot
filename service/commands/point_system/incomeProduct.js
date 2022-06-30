const { error, success } = require("../../utils/msgTemplate");
const { OfficialProduct } = require("../../schema/officialProduct");
const { Product } = require("../../schema/product");
const { ServerPoint } = require("../../schema/serverPoint")
const { updateServerPoints } = require("../../crud/updateServerPoints");
const { updatePointAdjustLog } = require("../../crud/updatePointAdjustLog");
const { eventType } = require("../../config");
const _ = require('lodash')

const { addOrUpdateUser } = require("../../utils/addOrUpdateUser")

module.exports = {
  name: "income_product",
  description: "從官方商店進貨",
  options: [
      {
        type: 3,
        name: "item",
        description: "輸入商品代表id",
        required: true,
      },
      {
        type: 3,
        name: "amount",
        description: "輸入進貨數量",
        required: true,
      },
    ],
    run: async (client, interaction, args) => {
      try {
      await addOrUpdateUser(interaction)
      
      // 判斷是否有此商品
      const officialProduct = await OfficialProduct.findOne({
        roleId: args['item']
      })

      if (!officialProduct) {
        return error({
          msg: `官方商店無此商品`,
          interaction,
        });
      }

      // 判斷商品數量是否大於進貨數量
      if (args['amount'] > officialProduct.amount) {
        return error({
          msg: `進貨數量大於此商品數量`,
          interaction,
        });
      }

      // 判斷使用者帳戶是否足夠購買進貨數量的金額
      const point = await ServerPoint.findOne({
        serverId: interaction.guildId,
        userDiscordId: interaction.user.id,
      })

      if (args['amount'] * officialProduct.price > point.totalPoints) {
        return error({
          msg: `進貨總金額大於我的餘額`,
          interaction,
        });
      }

      // 進貨
      // 1 扣掉金額
      // 2 扣除官方商店商品數量
      // 3. 新增 product
      await updateServerPoints({
        serverId: interaction.guildId,
        userDiscordId: interaction.user.id,
        point: -1 * args['amount'] * officialProduct.price,
      });

      await updatePointAdjustLog({
        amount: -1 * args['amount'] * officialProduct.price,
        serverId: interaction.guildId,
        userDiscordId: interaction.user.id,
        eventType: eventType.income_product,
      });

      officialProduct.amount = officialProduct.amount - args['amount']
      await officialProduct.save();

      await Promise.all(_.range(args['amount']).map(async product => {
        try {
          const product = new Product({
            created_at: Date(),
            updated_at: Date(),
            name: officialProduct.name,
            roleId: args['item'],
            price: 0,
            serverId: interaction.guildId,
            userId: interaction.user.id,
            isOnShop: false,
          })
          await product.save()
        } catch (error) {
          console.log(error)
        }
      }));

      return success({
        msg: `${officialProduct.name}` + `已進貨。數量：${args["amount"]}個，可使用` + '`/my_item` 查看自己的背包',
        interaction,
      });

      
    } catch (error) {
      console.log(error);
    }
  },
};
