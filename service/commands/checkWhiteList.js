// const { User } = require("../schema/user");
const { WhiteList } = require("../schema/whiteList");
const { error, multiFieldsMsg, success } = require("../utils/msgTemplate");

module.exports = {
  name: "check_whitelist",
  description: "Check all added whitelist",
  run: async (client, interaction, args) => {

    const list = await WhiteList.find({
      serverId: interaction.guildId,
    });

    if (!list || !list.length) {
      return error({
        msg: `there are no whitelists`,
        interaction,
      });
    }
    const message_whitelist = list.map((item, i) => ({
      name: `Whitelist-${i + 1}`,
      value: item.name,
      inline: true,
    }));
    return multiFieldsMsg({
      msgFields: message_whitelist,
      interaction,
    });
  },
};
