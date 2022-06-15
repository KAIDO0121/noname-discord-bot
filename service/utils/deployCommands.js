const { REST } = require("@discordjs/rest");
const Discord = require("discord.js");
const { Routes } = require("discord-api-types/v9");
const { Server } = require("../schema/server");
const { deployEvents } = require("../utils/deployEvents");
const { noNameServerId } = require("../config")
const fs = require("node:fs");
/* import moralis */
const Moralis = require("moralis/node");

module.exports = {
  deployCommands: async (client) => {
    client.commands = new Discord.Collection();

    try {
      const res = await Moralis.start({ serverUrl: process.env.MORALIS_SERVERURL, appId: process.env.MORALIS_APPID, masterKey: process.env.MORALIS_KEY });

    } catch (error) {
      console.log(error)
    }


    const commandFiles = fs
      .readdirSync("./service/commands")
      .filter((file) => file.endsWith(".js"));

    // Place your client and guild ids here
    let client_id = process.env.NODE_ENV == 'production' ? process.env.CLIENT_ID_PRD : process.env.CLIENT_ID_DEV;
    const clientId = client_id;

    for (const file of commandFiles) {
      const command = require(`../commands/${file}`);
      client.commands.set(command.name, command);
    }

    const normalCMDSets = JSON.parse(JSON.stringify(client.commands))

    delete normalCMDSets.nftToRoles

    console.log(process.env.NODE_ENV, 'NODE_ENV')

    let token = process.env.NODE_ENV == 'production' ? process.env.DISCORD_BOT_TOKEN_PRD : process.env.DISCORD_BOT_TOKEN_DEV;
    const rest = new REST({ version: "9" }).setToken(
      token
    );

    // try to redeploy all commands to all server
    (async () => {
      console.log("Started refreshing application (/) commands.");
      const servers = await Server.find();
      servers.forEach(async (guild) => {
        try {
          const res = await rest.put(
            Routes.applicationGuildCommands(clientId, guild.serverId),
            {
              body: guild.serverId === noNameServerId ? client.commands : normalCMDSets
            }
          );
        } catch (error) {
          console.error(error);
        }
      });
      console.log("Successfully reloaded application (/) commands.");
      deployEvents(client);
    })();
  },
};
