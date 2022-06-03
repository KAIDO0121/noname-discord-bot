const { REST } = require("@discordjs/rest");
const Discord = require("discord.js");
const { Routes } = require("discord-api-types/v9");
const { Server } = require("../schema/server");
const { deployEvents } = require("../utils/deployEvents");
const fs = require("node:fs");

module.exports = {
  deployCommands: (client) => {
    client.commands = new Discord.Collection();
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

    console.log(process.env.NODE_ENV, 'NODE_ENV')

    let token = process.env.NODE_ENV == 'production' ? process.env.DISCORD_BOT_TOKEN_PRD : process.env.DISCORD_BOT_TOKEN_DEV;
    const rest = new REST({ version: "9" }).setToken(
      token
    );

    (async () => {
      console.log("Started refreshing application (/) commands.");
      const servers = await Server.find();
      servers.forEach(async (guild) => {
        try {
          const res = await rest.put(
            Routes.applicationGuildCommands(clientId, guild.serverId),
            {
              body: client.commands,
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
