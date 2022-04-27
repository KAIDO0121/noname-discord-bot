require("dotenv").config();
const Discord = require("discord.js");

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const mongoose = require("mongoose");
const { join } = require("path");
const { readdirSync } = require("fs");
client.commands = new Discord.Collection();
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/db");
}

const PREFIX = "$";

client.on("ready", () => {
  console.log(`${client.user.tag} has logged in.`);
});

const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) =>
  file.endsWith(".js")
);

for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("messageCreate", async (message) => {
  let prefix = await db.get(`prefix_${message.guild.id}`);
  if (prefix === null) prefix = PREFIX;
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  if (message.content.startsWith(prefix)) {
    let premiumcheck = db.get(`blacklisted`);

    if (
      premiumcheck &&
      premiumcheck.find((find) => find.kid == message.author.id)
    )
      return message.channel.send(`you cant use the bot your blacklisted!!`);

    const args = message.content.slice(prefix.length).trim().split(/ +/);

    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
      client.commands.get(command).run(client, message, args);
    } catch (error) {
      console.error(error);
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
