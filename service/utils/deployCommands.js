const { REST } = require("@discordjs/rest");
const Discord = require("discord.js");
const { Routes } = require("discord-api-types/v9");
const { Server } = require("../schema/server");
const fs = require("node:fs");

module.exports = {
  deployCommands: (client) => {
    client.commands = new Discord.Collection();
    const commandFiles = fs
      .readdirSync("./service/commands")
      .filter((file) => file.endsWith(".js"));

    // Place your client and guild ids here
    const clientId = process.env.CLIENT_ID;

    for (const file of commandFiles) {
      const command = require(`../commands/${file}`);
      client.commands.set(command.name, command);
    }

    const rest = new REST({ version: "9" }).setToken(
      process.env.DISCORD_BOT_TOKEN
    );

    (async () => {
      try {
        console.log("Started refreshing application (/) commands.");
        const servers = await Server.find();
        servers.forEach(async (guild) => {
          await rest.put(
            Routes.applicationGuildCommands(clientId, guild.serverId),
            {
              body: client.commands,
            }
          );
        });

        console.log("Successfully reloaded application (/) commands.");
      } catch (error) {
        console.error(error);
      }
    })();
  },
};
