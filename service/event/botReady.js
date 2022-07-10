const Discord = require("discord.js");
const { deployCommands } = require("../utils/deployCommands");
const { subscribeHelper } = require("../utils/subscribeHelper")
const { MonitorChannelToContract } = require("../schema/monitorChannelToContract")

const client = new Discord.Client({
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    "GUILD_MESSAGES",
  ],
});

module.exports = {
  discordBotClient: client,
  botReady: () => {
    let token = process.env.NODE_ENV == 'production' ? process.env.DISCORD_BOT_TOKEN_PRD : process.env.DISCORD_BOT_TOKEN_DEV;
    client.login(token);
    client.on("ready", async () => {
      console.log(`${client.user.tag} has logged in.`);
      const allMonitor = await MonitorChannelToContract.find({}).select({ channelIdToBlockNumber: 1, serverId: 1 })

      // loop through all server
      allMonitor.forEach((record) => {
        // loop through all monitor in that server 
        Object.entries(record.channelIdToBlockNumber).reduce(async (acc, [channelId, value]) => {

          const channel = await client.channels.fetch(channelId)
          if (channel && value && value.blockNumber) {

            const id = subscribeHelper({ blockNumber: value.blockNumber, channel })

            const intervalKey = `channelIdToBlockNumber.${[channelId]}.intervalId`
            const query = { serverId: record.serverId };
            const update = { $set: { [intervalKey]: Number(id) } }
            const options = { upsert: true, returnDocument: "before" };
            await MonitorChannelToContract.findOneAndUpdate(query, update, options)
          }

        }, {})

      })
      deployCommands(client);
    });
  },
};
