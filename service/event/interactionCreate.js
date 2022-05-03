module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) {
        return interaction
          .reply({ content: "An error has occurred ", ephemeral: true })
          .catch((error) => client.utils.log.handler("error", error));
      }
      const args = {};
      for (const option of interaction.options.data) {
        if (option.type === "SUB_COMMAND") {
          if (option.name) args[option.name] = true;
          option.options?.forEach((x) => {
            args[x.name] = x.value;
          });
        } else if (option.value) {
          args[option.name] = option.value;
        }
      }
      interaction.member = interaction.guild.members.cache.get(
        interaction.user.id
      );
      try {
        command.run(client, interaction, args);
      } catch (error) {
        client.utils.log.error(error);
        interaction
          .reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          })
          .catch((err) => client.utils.log.handler("error", err));
      }
    }
    // if (interaction.isSelectMenu()) {
    //   const command = client.commands.get(interaction.values[0].split("=")[0]);
    //   if (command) command.run(client, interaction);
    // }
  },
};

// SelectMenuInteraction {
//   type: 'MESSAGE_COMPONENT',
//   id: '970952183723995137',
//   applicationId: '968127131420852236',
//   channelId: '968131609683439689',
//   guildId: '968131609163358259',
//   user: User {
//     id: '874315467081285742',
//     bot: false,
//     system: false,
//     flags: UserFlags { bitfield: 0 },
//     username: 'Sean Liao',
//     discriminator: '5038',
//     avatar: null,
//     banner: undefined,
//     accentColor: undefined
//   },
//   member: GuildMember {
//     guild: Guild {
//       id: '968131609163358259',
//       name: 'test123',
//       icon: null,
//       features: [],
//       commands: [GuildApplicationCommandManager],
//       members: [GuildMemberManager],
//       channels: [GuildChannelManager],
//       bans: [GuildBanManager],
//       roles: [RoleManager],
//       presences: PresenceManager {},
//       voiceStates: [VoiceStateManager],
//       stageInstances: [StageInstanceManager],
//       invites: [GuildInviteManager],
//       scheduledEvents: [GuildScheduledEventManager],
//       available: true,
//       shardId: 0,
//       splash: null,
//       banner: null,
//       description: null,
//       verificationLevel: 'NONE',
//       vanityURLCode: null,
//       nsfwLevel: 'DEFAULT',
//       discoverySplash: null,
//       memberCount: 4,
//       large: false,
//       premiumProgressBarEnabled: false,
//       applicationId: null,
//       afkTimeout: 300,
//       afkChannelId: null,
//       systemChannelId: '968131609683439689',
//       premiumTier: 'NONE',
//       premiumSubscriptionCount: 0,
//       explicitContentFilter: 'DISABLED',
//       mfaLevel: 'NONE',
//       joinedTimestamp: 1651562796222,
//       defaultMessageNotifications: 'ALL_MESSAGES',
//       systemChannelFlags: [SystemChannelFlags],
//       maximumMembers: 500000,
//       maximumPresences: null,
//       approximateMemberCount: null,
//       approximatePresenceCount: null,
//       vanityURLUses: null,
//       rulesChannelId: null,
//       publicUpdatesChannelId: null,
//       preferredLocale: 'en-US',
//       ownerId: '874315467081285742',
//       emojis: [GuildEmojiManager],
//       stickers: [GuildStickerManager]
//     },
//     joinedTimestamp: 1650890962728,
//     premiumSinceTimestamp: null,
//     nickname: null,
//     pending: false,
//     communicationDisabledUntilTimestamp: null,
//     _roles: [],
//     user: User {
//       id: '874315467081285742',
//       bot: false,
//       system: false,
//       flags: [UserFlags],
//       username: 'Sean Liao',
//       discriminator: '5038',
//       avatar: null,
//       banner: undefined,
//       accentColor: undefined
//     },
//     avatar: null
//   },
//   version: 1,
//   memberPermissions: Permissions { bitfield: 4398046511103n },
//   locale: 'zh-TW',
//   guildLocale: 'en-US',
//   message: <ref *1> Message {
//     channelId: '968131609683439689',
//     guildId: '968131609163358259',
//     id: '970950936736432128',
//     createdTimestamp: 1651563142714,
//     type: 'APPLICATION_COMMAND',
//     system: false,
//     content: 'Select event type',
//     author: ClientUser {
//       id: '968127131420852236',
//       bot: true,
//       system: false,
//       flags: [UserFlags],
//       username: 'DisBot',
//       discriminator: '1072',
//       avatar: '626c7c4f0e9b7502dc0a1d6d08fd0064',
//       banner: undefined,
//       accentColor: undefined,
//       verified: true,
//       mfaEnabled: false
//     },
//     pinned: false,
//     tts: false,
//     nonce: null,
//     embeds: [],
//     components: [ [MessageActionRow] ],
//     attachments: Collection(0) [Map] {},
//     stickers: Collection(0) [Map] {},
//     editedTimestamp: null,
//     reactions: ReactionManager { message: [Circular *1] },
//     mentions: MessageMentions {
//       everyone: false,
//       users: Collection(0) [Map] {},
//       roles: Collection(0) [Map] {},
//       _members: null,
//       _channels: null,
//       crosspostedChannels: Collection(0) [Map] {},
//       repliedUser: null
//     },
//     webhookId: '968127131420852236',
//     groupActivityApplication: null,
//     applicationId: '968127131420852236',
//     activity: null,
//     flags: MessageFlags { bitfield: 64 },
//     reference: null,
//     interaction: {
//       id: '970950934815445012',
//       type: 'APPLICATION_COMMAND',
//       commandName: 'show_event_type',
//       user: [User]
//     }
//   },
//   customId: 'select',
//   componentType: 'SELECT_MENU',
//   deferred: false,
//   ephemeral: null,
//   replied: false,
//   webhook: InteractionWebhook { id: '968127131420852236' },
//   values: [ '99999' ]
// }
