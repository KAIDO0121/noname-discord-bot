const { Server } = require("../schema/server");

module.exports = {
  name: "guildCreate",
  run: async (client, interaction) => {
    console.log("Joined a new guild: " + interaction.name);
    try {
      const server = await Server.findOne({ serverId: interaction.id });

      if (!server) {
        const newServer = new Server({
          name: interaction.name,
          serverId: interaction.id,
          createdAt: Date(),
          updatedAt: Date(),
        });
        await newServer.save();
      } else {
        console.log("Server already exist");
      }
    } catch (error) {
      console.log(error);
    }
  },
};
