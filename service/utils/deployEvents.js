const fs = require("node:fs");

module.exports = {
  deployEvents: (client) => {
    const eventFiles = fs
      .readdirSync("./service/event")
      .filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      const event = require(`../event/${file}`);
      if (event.once) {
        client.once(event.name, (...args) => event.run(client, args[0]));
      } else {
        client.on(event.name, (...args) => {
          event.run(client, args[0]);
        });
      }
    }
  },
};
