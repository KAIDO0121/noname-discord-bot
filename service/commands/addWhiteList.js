const { Server } = require("../schema/server");
const { WhiteList } = require("../schema/whiteList");
const { error, success } = require("../utils/msgTemplate");

module.exports = {
  name: "add_whitelist",
  description: "Create a white list",
  options: [
    {
      type: 3,
      name: "white_list_name",
      description: "Give a name to the new white list",
      required: true,
    },
  ],
  run: async (client, interaction, args) => {
    try {
      const server = await Server.findOne({ serverId: interaction.guildId });

      if (server?.whiteLists?.includes(args["white_list_name"])) {
        return error({
          msg: `List :${args["white_list_name"]} already exists`,
          interaction,
        });
      }
      server.whiteLists.push(args["white_list_name"]);
      await server.save();
      const newList = new WhiteList({
        name: args["white_list_name"],
        created_at: Date(),
        updated_at: Date(),
        users: [],
        serverId: interaction.guildId,
      });
      await newList.save();
      return success({
        msg: `List :${args["white_list_name"]} added successfully`,
        interaction,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
