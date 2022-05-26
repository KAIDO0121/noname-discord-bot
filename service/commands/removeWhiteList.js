const { Server } = require("../schema/server");
const { WhiteList } = require("../schema/whiteList");
const { error, success } = require("../utils/msgTemplate");

module.exports = {
  name: "remove_whitelist",
  description: "Remove a white list",
  options: [
    {
      type: 3,
      name: "white_list_name",
      description: "Enter the name of the white list you want to remove",
      required: true,
    },
  ],
  run: async (client, interaction, args) => {
    try {
      const server = await Server.findOne({ serverId: interaction.guildId });

      if (!server?.whiteLists.includes(args["white_list_name"])) {
        return error({
          msg: `List :${args["white_list_name"]} not found`,
          interaction,
        });
      }
      server.whiteLists = server.whiteLists.filter(
        (l) => l !== args["white_list_name"]
      );
      await server.save();
      await WhiteList.findOneAndRemove({
        name: args["white_list_name"],
        serverId: interaction.guildId,
      });
      
      return success({
        msg: `List :${args["white_list_name"]} removed successfully`,
        interaction,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
