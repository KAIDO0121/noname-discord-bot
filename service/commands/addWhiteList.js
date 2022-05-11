const { Server } = require("../schema/server");
const { error, success } = require("../utils/msgTemplate");

module.exports = {
  name: "add_white_list",
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

      if (!server.whiteLists) server.whiteLists = [];
      if (server.whiteLists.includes(args["white_list_name"])) {
        return error({
          msg: `List :${args["white_list_name"]} already exists`,
          interaction,
        });
      }
      server.whiteLists.push(args["white_list_name"]);
      await server.save();
      return success({
        msg: `List :${args["white_list_name"]} added successfully`,
        interaction,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
