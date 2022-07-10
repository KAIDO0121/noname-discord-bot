const { success } = require("../utils/msgTemplate");
const { MonitorChannelToContract } = require("../schema/monitorChannelToContract")

module.exports = {
    name: "stop_monitor_contract",
    description: "停止此頻道的監聽推播",
    run: async (client, interaction) => {
        try {
            const field = `channelIdToBlockNumber.${[interaction.channelId]}`
            const query = { serverId: interaction.guildId };
            const update = { $set: { [field]: {} } }
            const options = { upsert: true, returnDocument: "before" };
            const doc = await MonitorChannelToContract.findOneAndUpdate(query, update, options)
            clearInterval(doc.channelIdToBlockNumber[interaction.channelId].intervalId)

            return success({
                msg: `推播已停止`,
                interaction,
            });

        } catch (error) {
            console.log(error)
        }
    },
};
