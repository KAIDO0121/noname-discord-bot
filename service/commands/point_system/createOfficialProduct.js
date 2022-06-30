const { error, success } = require("../../utils/msgTemplate");

const { OfficialShop } = require("../../schema/officialShop");
const { OfficialProduct } = require("../../schema/officialProduct");

const { Server } = require("../../schema/server");
const { addOrUpdateUser } = require("../../utils/addOrUpdateUser")

module.exports = {
  name: "create_official_product",
  description: "創建本伺服器官方商品",
  options: [
    {
      type: 8,
      name: "role",
      description: "選擇商品(身分組)",
      required: true,
    },
    {
      type: 3,
      name: "amount",
      description: "輸入上架數量",
      required: true,
    },
    {
      type: 3,
      name: "price",
      description: "輸入商品價格 :coin:",
      required: true,
    },
  ],
  run: async (client, interaction, args) => {
    await addOrUpdateUser(interaction)
    try {
      const server = await Server.findOne({ serverId: interaction.guildId });
      
      if (!server?.shopId) {
        return error({
          msg: '請先使用 `/create_official_shop` 創建官方商店',
          interaction,
        });
      }
      
      // 判斷有沒有重複商品
      const officialProduct = await OfficialProduct.findOne({
        serverId: interaction.guildId,
        roleId: args["role"]
      })

      const name = interaction.guild.roles.cache.find(r => r.id === args["role"])?.name

      if (officialProduct) {
        // 更新數量及價格
        officialProduct.amount = Number(args["amount"])
        officialProduct.price = args["price"]
        await officialProduct.save();
        return success({
          msg: `商品已更新數量：${Number(args["amount"])}，及價格：${args["price"]}`,
          interaction,
        });
      } else {
        // 新增商品至商店
        const newProduct = new OfficialProduct({
          created_at: Date(),
          updated_at: Date(),
          name: name,
          roleId: args["role"],
          price: args["price"],
          amount: args["amount"],
          serverId: interaction.guildId,
        });
        await newProduct.save()
        const officialShop = await OfficialShop.findOne({ serverId: interaction.guildId });
        officialShop.officialProductIds.push(args["role"]);
        await officialShop.save();
      }

      return success({
        msg: `${name}已創建。數量：${args["amount"]}個，價格：${args["price"]}`,
        interaction,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
