const { error, success } = require("../../utils/msgTemplate");
const { OfficialProduct } = require("../../schema/officialProduct");

const { Server } = require("../../schema/server");
const { addOrUpdateUser } = require("../../utils/addOrUpdateUser")

module.exports = {
  name: "remove_official_product",
  description: "移除本伺服器官方商品",
  options: [
    {
      type: 8,
      name: "item",
      description: "選擇商品(身分組)",
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

      const res = await OfficialProduct.findOneAndRemove({
        roleId: args["item"],
        serverId: interaction.guildId,
      });

      console.log(res, 'res')

      return success({
        msg: `商品 ${args["item"]} 已刪除`,
        interaction,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
