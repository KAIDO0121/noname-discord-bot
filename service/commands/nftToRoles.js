const { error, success } = require("../utils/msgTemplate")
const Moralis = require("moralis/node");



module.exports = {
    name: "check_un",
    description: "Depends on NFT to give user a role",
    options: [
        {
            type: 3,
            name: "address",
            description: "Enter the wallet address you want to use",
            required: true,
        },
    ],
    run: async (client, interaction, args) => {
        try {

            const res = await Moralis.start({ serverUrl: process.env.MORALIS_SERVERURL, appId: process.env.MORALIS_APPID, masterKey: process.env.MORALIS_KEY });

            const options = {
                chain: "mainnet",
                address: args["address"],
            };

            const NFTs = await Moralis.Web3API.account.getNFTs(options);
            const NFT = NFTs.find(el => el.symbol === 'SACC').symbol || 'none'
            const allRoles = interaction.member.guild.roles
            // interaction.member.roles.add(NFTMapping[NFT])

            return success({
                msg: `You have been given ${NFTMapping[NFT]} `,
                interaction,
            })
        } catch (error) {
            console.log(error)
        }
    },
}


    // CommandInteraction {
    //     type: 'APPLICATION_COMMAND',
    //         id: '986610941405855744',
    //             applicationId: '982118466830106664',
    //                 channelId: '968131609683439689',
    //                     guildId: '968131609163358259',
    //                         user: User {
    //         id: '874315467081285742',
    //             bot: false,
    //                 system: false,
    //                     flags: UserFlags { bitfield: 0 },
    //         username: 'Sean Liao',
    //             discriminator: '5038',
    //                 avatar: 'b2fe718cde86c902f2ba77b7e4e89b48',
    //                     banner: undefined,
    //                         accentColor: undefined
    //     },
    //     member: GuildMember {
    //         guild: Guild {
    //             id: '968131609163358259',
    //                 name: 'test123',
    //                     icon: null,
    //                         features: [],
    //                             commands: [GuildApplicationCommandManager],
    //                                 members: [GuildMemberManager],
    //                                     channels: [GuildChannelManager],
    //                                         bans: [GuildBanManager],
    //                                             roles: [RoleManager],
    //                                                 presences: PresenceManager { },
    //             voiceStates: [VoiceStateManager],
    //                 stageInstances: [StageInstanceManager],
    //                     invites: [GuildInviteManager],
    //                         scheduledEvents: [GuildScheduledEventManager],
    //                             available: true,
    //                                 shardId: 0,
    //                                     splash: null,
    //                                         banner: null,
    //                                             description: null,
    //                                                 verificationLevel: 'NONE',
    //                                                     vanityURLCode: null,
    //                                                         nsfwLevel: 'DEFAULT',
    //                                                             discoverySplash: null,
    //                                                                 memberCount: 16,
    //                                                                     large: false,
    //                                                                         premiumProgressBarEnabled: false,
    //                                                                             applicationId: null,
    //                                                                                 afkTimeout: 300,
    //                                                                                     afkChannelId: null,
    //                                                                                         systemChannelId: '968131609683439689',
    //                                                                                             premiumTier: 'NONE',
    //                                                                                                 premiumSubscriptionCount: 0,
    //                                                                                                     explicitContentFilter: 'DISABLED',
    //                                                                                                         mfaLevel: 'NONE',
    //                                                                                                             joinedTimestamp: 1655296322753,
    //                                                                                                                 defaultMessageNotifications: 'ALL_MESSAGES',
    //                                                                                                                     systemChannelFlags: [SystemChannelFlags],
    //                                                                                                                         maximumMembers: 500000,
    //                                                                                                                             maximumPresences: null,
    //                                                                                                                                 approximateMemberCount: null,
    //                                                                                                                                     approximatePresenceCount: null,
    //                                                                                                                                         vanityURLUses: null,
    //                                                                                                                                             rulesChannelId: null,
    //                                                                                                                                                 publicUpdatesChannelId: null,
    //                                                                                                                                                     preferredLocale: 'en-US',
    //                                                                                                                                                         ownerId: '874315467081285742',
    //                                                                                                                                                             emojis: [GuildEmojiManager],
    //                                                                                                                                                                 stickers: [GuildStickerManager]
    //         },
    //         joinedTimestamp: 1650890962728,
    //             premiumSinceTimestamp: null,
    //                 nickname: 'NSML',
    //                     pending: false,
    //                         communicationDisabledUntilTimestamp: null,
    //                             _roles: [],
    //                                 user: User {
    //             id: '874315467081285742',
    //                 bot: false,
    //                     system: false,
    //                         flags: [UserFlags],
    //                             username: 'Sean Liao',
    //                                 discriminator: '5038',
    //                                     avatar: 'b2fe718cde86c902f2ba77b7e4e89b48',
    //                                         banner: undefined,
    //                                             accentColor: undefined
    //         },
    //         avatar: null
    //     },
    //     version: 1,
    //         memberPermissions: Permissions { bitfield: 4398046511103n },
    //     locale: 'zh-TW',
    //         guildLocale: 'en-US',
    //             commandId: '986609117718257671',
    //                 commandName: 'check_un',
    //                     deferred: false,
    //                         replied: false,
    //                             ephemeral: null,
    //                                 webhook: InteractionWebhook { id: '982118466830106664' },
    //     options: CommandInteractionOptionResolver {
    //         _group: null,
    //             _subcommand: null,
    //                 _hoistedOptions: [[Object]]
    //     }
    // }

//     < ref * 2 > RoleManager {
//     guild: <ref * 1 > Guild {
//         id: '968131609163358259',
//             name: 'test123',
//                 icon: null,
//                     features: [],
//                         commands: GuildApplicationCommandManager {
//             permissions: [ApplicationCommandPermissionsManager],
//                 guild: [Circular * 1]
//         },
//         members: GuildMemberManager { guild: [Circular * 1] },
//         channels: GuildChannelManager { guild: [Circular * 1] },
//         bans: GuildBanManager { guild: [Circular * 1] },
//         roles: [Circular * 2],
//             presences: PresenceManager { },
//         voiceStates: VoiceStateManager { guild: [Circular * 1] },
//         stageInstances: StageInstanceManager { guild: [Circular * 1] },
//         invites: GuildInviteManager { guild: [Circular * 1] },
//         scheduledEvents: GuildScheduledEventManager { guild: [Circular * 1] },
//         available: true,
//             shardId: 0,
//                 splash: null,
//                     banner: null,
//                         description: null,
//                             verificationLevel: 'NONE',
//                                 vanityURLCode: null,
//                                     nsfwLevel: 'DEFAULT',
//                                         discoverySplash: null,
//                                             memberCount: 16,
//                                                 large: false,
//                                                     premiumProgressBarEnabled: false,
//                                                         applicationId: null,
//                                                             afkTimeout: 300,
//                                                                 afkChannelId: null,
//                                                                     systemChannelId: '968131609683439689',
//                                                                         premiumTier: 'NONE',
//                                                                             premiumSubscriptionCount: 0,
//                                                                                 explicitContentFilter: 'DISABLED',
//                                                                                     mfaLevel: 'NONE',
//                                                                                         joinedTimestamp: 1655296322753,
//                                                                                             defaultMessageNotifications: 'ALL_MESSAGES',
//                                                                                                 systemChannelFlags: SystemChannelFlags { bitfield: 0 },
//         maximumMembers: 500000,
//             maximumPresences: null,
//                 approximateMemberCount: null,
//                     approximatePresenceCount: null,
//                         vanityURLUses: null,
//                             rulesChannelId: null,
//                                 publicUpdatesChannelId: null,
//                                     preferredLocale: 'en-US',
//                                         ownerId: '874315467081285742',
//                                             emojis: GuildEmojiManager { guild: [Circular * 1] },
//         stickers: GuildStickerManager { guild: [Circular * 1] }
//     }
// }
