const { Server } = require("../schema/server");
const { WhiteList } = require("../schema/whiteList");
const { error, success } = require("../utils/msgTemplate");

module.exports = {
  name: "remove_user_from_whitelist",
  description: "Remove user from white list",
  options: [
    {
      type: 3,
      name: "white_list_name",
      description: "Enter the white list you want to edit",
      required: true,
    },
    {
      type: 6,
      name: "user_to_remove",
      description: "Set the user you want to remove",
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
        users: args["user_to_remove"],
      });

      if (!server || !list) {
        return error({
          msg: `Can't find List :${args["white_list_name"]}`,
          interaction,
        });
      }

      if (!list?.users?.includes(args["user_to_remove"])) {
        return error({
          msg: `Can't find user in list : ${args["white_list_name"]}`,
          interaction,
        });
      }

      list.users = list.users.filter((user) => user !== args["user_to_remove"]);
      await list.save();
      return success({
        msg: `User removed successfully`,
        interaction,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
