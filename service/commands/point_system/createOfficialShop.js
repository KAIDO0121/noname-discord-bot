const { error, multiFieldsMsg, success } = require("../../utils/msgTemplate");

const { OfficialShop } = require("../../schema/officialShop");
const { Server } = require("../../schema/server");
const { addOrUpdateUser } = require("../../utils/addOrUpdateUser")

module.exports = {
  name: "create_official_shop",
  description: "創建本伺服器官方商品",
  run: async (client, interaction, args) => {
    
    try {
      await addOrUpdateUser(interaction)
      const server = await Server.findOne({ serverId: interaction.guildId });
      // 判斷目前是否有商店
      if (server?.shopId) {
        return error({
          msg: `本伺服器已創建過未來商城`,
          interaction,
        });
      }

      // 創建商店
      const newShop = new OfficialShop({
        created_at: Date(),
        updated_at: Date(),
        serverId: interaction.guildId,
        officialProductIds: [],
      });
      const res = await newShop.save();
      server.shopId = res.serverId
      await server.save();
      return success({
        msg: `未來商城已創建`,
        interaction,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
