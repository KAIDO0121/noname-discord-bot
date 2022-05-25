const { Server } = require("../schema/server");
const { WhiteList } = require("../schema/whiteList");
const { error, success } = require("../utils/msgTemplate");

module.exports = {
  name: "add_user_to_whitelist",
  description: "Add user to white list",
  options: [
    {
      type: 3,
      name: "white_list_name",
      description: "Enter the white list you want to add user to",
      required: true,
    },
    {
      type: 6,
      name: "user_to_add",
      description: "Set the user you want to add",
      required: true,
    },
  ],
  run: async (client, interaction, args) => {
    try {
      const server = await Server.findOne({
        serverId: interaction.guildId,
        whiteLists: args["white_list_name"],
      });

      const list = await WhiteList.findOne({
        serverId: interaction.guildId,
        name: args["white_list_name"],
      });

      if (!server || !list) {
        return error({
          msg: `Can't find List :${args["white_list_name"]}`,
          interaction,
        });
      }
      if (list?.users?.includes(args["user_to_add"])) {
        return error({
          msg: `User already exists in ${args["white_list_name"]}`,
          interaction,
        });
      }

      list.users.push(args["user_to_add"]);
      await list.save();
      return success({
        msg: `User added successfully`,
        interaction,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
