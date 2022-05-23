require("dotenv").config();
const mongoose = require("mongoose");

const { botReady } = require("./event/botReady");

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
  } catch (error) {
    console.error(error);
  }
}
main();
botReady();

// client.on("interactionCreate", async (interaction) => {
//   if (!interaction.isCommand()) return;

//   const command = client.commands.get(interaction.commandName);

//   if (!command) return;

//   try {
//     await command.execute(interaction);
//   } catch (error) {
//     console.error(error);
//     await interaction.reply({
//       content: "There was an error while executing this command!",
//       ephemeral: true,
//     });
//   }
// });
