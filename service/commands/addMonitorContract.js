const { success } = require("../utils/msgTemplate");
const { subscribeHelper } = require("../utils/subscribeHelper")
const { MonitorChannelToContract } = require("../schema/monitorChannelToContract")

module.exports = {
  name: "monitor_contract",
  description: "在此頻道每5分鐘推播合約transfer事件",
  options: [
    {
      type: 3,
      name: "block_number",
      description: "請輸入要監聽的block number, 若此頻道已擁有監聽的合約, 該設定將被覆蓋",
      required: true,
    }
  ],
  run: async (client, interaction, args) => {
    try {
      const id = subscribeHelper({ blockNumber: args['block_number'], channel: interaction.channel })

      const blockKey = `channelIdToBlockNumber.${[interaction.channelId]}.blockNumber`
      const intervalKey = `channelIdToBlockNumber.${[interaction.channelId]}.intervalId`
      const query = { serverId: interaction.guildId };
      const update = {
        $set: {
          [blockKey]: args['block_number'],
          [intervalKey]: Number(id)
        }
      };
      const options = { upsert: true, returnDocument: "before" };
      const doc = await MonitorChannelToContract.findOneAndUpdate(query, update, options)
      clearInterval(doc.channelIdToBlockNumber[interaction.channelId].intervalId)

      success({
        msg: `已成功訂閱 block number : ${args['block_number']}`,
        interaction,
      });

    } catch (error) {
      console.log(error)
    }
  },
};
