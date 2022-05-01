const Discord = require("discord.js");
module.exports = {
  name: "add_white_list",
  description: "Vouch Users",
  run: async (client, message, args) => {
    let guild = message.guild.iconURL();
    let wordlist = new Discord.MessageEmbed().setThumbnail(guild);
    // .setFooter({message.author.username, message.author.displayAvatarURL});
    // let database = db.get(`trustedusers_${message.guild.id}`);
    const database = [{ user: "Sean" }, { user: "David" }, { user: "Jane" }];
    if (database && database.length) {
      const array = database.map((m) => `<@${m.user}>`);

      wordlist.addField("** Trusted List **", `${array.join("\n")}`);
    }

    return message.channel.send({ embeds: [wordlist] });
  },
};
