const Discord = require("discord.js");
const { deployCommands } = require("../utils/deployCommands");

module.exports = {
  botReady: () => {
    const PREFIX = "$";
    const client = new Discord.Client({
      intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        "GUILD_MESSAGES",
      ],
    });
    let token = process.env.NODE_ENV == 'production' ? process.env.DISCORD_BOT_TOKEN_PRD : process.env.DISCORD_BOT_TOKEN_DEV;
    client.login(token);
    client.on("ready", () => {
      console.log(`${client.user.tag} has logged in.`);
      deployCommands(client);
    });
  },
};
