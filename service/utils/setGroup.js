const { User } = require("../schema/user");
const { updateServerPoints } = require("../crud/updateServerPoints")
const { updatePointAdjustLog } = require("../crud/updatePointAdjustLog")
const { eventType } = require("../config")
const { success, error } = require("./msgTemplate")


module.exports = {
  setGroup: async (client, interaction) => {
    let guild = await client.guilds.fetch(interaction.guildId)
    let member = guild.members.cache.get(interaction.user.id);

    
    let orc_id = process.env.NODE_ENV == 'production' ? 995255296555483247: 993958392798380212
    let gob_id = process.env.NODE_ENV == 'production' ? 995255411286487151: 993958483886100611
    let orc_role = guild.roles.cache.find(r => r.id == orc_id);
    let gob_role = guild.roles.cache.find(r => r.id == gob_id);
    // 判斷如果使用者擁有其中一個角色，就不能再變換陣營
    if (member._roles.includes(orc_role.id) || member._roles.includes(gob_role.id)) {
      return error({
        msg: '已選擇陣營，目前無法變更陣營',
        interaction,
      })
    }
    if (!orc_role || !gob_role)
        return console.log("the role doesn't exist");

    if (interaction.customId == 'goblins') {
      member.roles.add(gob_role);
      return success({
        msg: `您已成功選擇${gob_role.name}陣營！`,
        interaction,
      })
    } else if (interaction.customId == 'orcs') {
      member.roles.add(orc_role);
      return success({
        msg: `您已成功選擇${orc_role.name}陣營！`,
        interaction,
      })
    }

    return success({
      msg: '陣營選擇成功！',
      interaction,
    })
  }
}
