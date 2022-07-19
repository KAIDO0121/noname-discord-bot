const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, ModalBuilder } = require("discord.js")
const { description } = require('../commands/setPickRole')

const { User } = require("../schema/user")
const { OfficialProduct } = require("../schema/officialProduct");
const { Product } = require("../schema/product")
const { ServerPoint } = require("../schema/serverPoint")
const { updateServerPoints } = require("../crud/updateServerPoints")
const { updatePointAdjustLog } = require("../crud/updatePointAdjustLog")
const { eventType } = require("../config")
const _ = require('lodash')
const { addOrUpdateUser } = require("../utils/addOrUpdateUser")
const ObjectId = require('mongoose').Types.ObjectId

const number_emoji_list = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
]

const error = async ({ msg, title = "Error", interaction }) => {
  const embed = new MessageEmbed()
    .setColor("#FF5733")
    .setTitle(title)
    .setDescription(msg)

  await interaction
    .reply({ embeds: [embed], ephemeral: true })
    .then(() => console.log("Reply sent."))
    .catch(console.error)
}

const success = async ({ msg, title = "Success", interaction }) => {
  const embed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(title)
    .setDescription(msg)

  await interaction
    .reply({ embeds: [embed], ephemeral: true })
    .then(() => console.log("Reply sent."))
    .catch(console.error)
}

module.exports = {
  error,
  success,
  multiFieldsMsg: async ({ interaction, msgFields }) => {
    const embed = {
      color: "#0099ff",
      fields: msgFields,
    }
    try {
      await interaction
        .reply({ embeds: [embed], ephemeral: true })
        .then(() => console.log("Reply sent."))
        .catch(console.error)
    } catch (e) {
      console.log(e)
    }
  },
  multiFieldsMsgToChannel: async ({ channel, msgFields }) => {
    const embed = {
      color: "#0099ff",
      fields: msgFields,
    }
    try {
      await channel
        .send({ embeds: [embed] })
        .then(() => console.log("Reply sent."))
        .catch(console.error)
    } catch (e) {
      console.log(e)
    }
  },

  shopMsg: async ({ interaction, is_official = 0, user_name, productChunk, hint }) => {
    let shop_name
    if (is_official == 0) {
      shop_name = '官方商店'
    } else if (is_official == 1) {
      shop_name = `${user_name}的商店`
    } else if (is_official == 2) {
      shop_name = '拍賣所'
    } else {
      shop_name = '官方商店'
    }
    let shop_hint
    if (hint) {
      shop_hint = hint
    } else {
      shop_hint = (is_official != 1 || is_official != 2) ? '你可以使用 `/income_product [商品id] [數量]` 來進貨商品 \n\n' : '你可以使用 `/put_product [商品id]` 上架商品到自己的商店 \n\n'
    }

    const embeds = []
    productChunk.forEach((products, index) => {
      // 序數 圖標 商品名稱
      // 錢幣 金額 
      const products_list_text = products.map((product, index) =>
        `:${number_emoji_list[index + 1]}: ` + // 序數
        ':small_blue_diamond: ' + // 圖標
        `**${product.name}**` + // 商品名稱
        '\n' +
        ':coin:  ' +
        '`' + `${product.price}` + '` ' +
        `目前數量: ${product.amount}個` +
        '\n' +
        '商品id:' + '`' + `${product.id}` + '`' +
        '\n').join('\n')
      embeds.push(new MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`${shop_name} - Page ${index + 1}/${productChunk.length}`)
        .setDescription(
          user_name + " " + shop_hint +
          products_list_text
        ))
    })

    const replyEmbed = (msg) => {
      return new MessageEmbed()
        .setColor("#0099ff")
        .setDescription(msg)
    }

    const pages = {} // { userId: pageNumber }

    const id = interaction.user.id
    pages[id] = pages[id] || 0

    const getRow = (id) => {
      const row = new MessageActionRow()
      row.addComponents(
        new MessageButton()
          .setCustomId(`prev_shop`)
          .setStyle('SECONDARY')
          .setEmoji('◀')
          .setDisabled(pages[id] === 0)
      )
      row.addComponents(
        new MessageButton()
          .setCustomId(`next_shop`)
          .setStyle('SECONDARY')
          .setEmoji('▶')
          .setDisabled(pages[id] === embeds.length - 1)
      )

      return row
    }

    const getCheckRow = (value, name) => {
      const row = new MessageActionRow()
      row.addComponents(
        new MessageButton()
          .setCustomId(`check_buy_${value}_${name}_${is_official}`)
          .setStyle('PRIMARY')
          .setLabel(`確認${is_official != 0 ? '購買' : '進貨'} 商品: ${name}? ${is_official != 0 ? '' : '(一個)'}`)
      )


      return row
    }

    const getMenu = (list) => {
      const items = list.map((item) => ({
        label: item.name,
        description: ``,
        value: `${item.id}_${item.name}`,
      }))
      const row = new MessageActionRow()
      row.addComponents(
        new MessageSelectMenu()
          .setCustomId(`select_product`)
          .setPlaceholder('請選擇商品')
          .addOptions(items),
      )

      return row
    }
    let collector
    const filter = (i) => i.user.id === interaction.user.id
    const time = 1000 * 60 * 5
    const embed = embeds[pages[id]]
    await interaction
      .reply({
        embeds: [embed],
        components: is_official != 0 ? [getMenu(productChunk[pages[id]]), getRow(id)] : [getMenu(productChunk[pages[id]]), getRow(id)],
        ephemeral: true
      }).then(() => console.log("Reply sent."))
      .catch(console.error)
    const reply = await interaction.fetchReply()

    collector = await reply.createMessageComponentCollector({ filter, time })

    collector.on('collect', async (btnInt) => {
      if (!btnInt) {
        return
      }

      console.log(btnInt.customId, 'btnInt.customId')

      btnInt.deferUpdate()

      // if (btnInt.customId !== `prev_shop` && btnInt.customId !== `next_shop` && btnInt.customId !== 'select_product' && btnInt.custom) {
      //   return
      // }

      if (btnInt.customId === `prev_shop` && pages[id] > 0) {
        --pages[id]
      } else if (btnInt.customId === `next_shop` && pages[id] < embeds.length - 1) {
        ++pages[id]
      }

      if (btnInt.customId.includes('select_product')) {
        let value = btnInt.values[0].split('_')[0]
        let name = btnInt.values[0].split('_')[1]
        await interaction.editReply({
          embeds: [embeds[pages[id]]],
          components: [getMenu(productChunk[pages[id]]), getRow(id), getCheckRow(value, name)],
        }).then(() => console.log("Reply sent."))
          .catch(console.error)
      } else {
        await interaction.editReply({
          embeds: [embeds[pages[id]]],
          components: is_official != 0 ? [getMenu(productChunk[pages[id]]), getRow(id)] : [getMenu(productChunk[pages[id]]), getRow(id)],
        }).then(() => console.log("Reply sent."))
          .catch(console.error)
      }

      if (btnInt.customId.includes('check_buy')) {
        const value = btnInt.customId.split('_')[2]
        const name = btnInt.customId.split('_')[3]
        const is_official = btnInt.customId.split('_')[4]
        console.log(value, 'buy value', name, 'buy name', is_official, 'is_official')
        let args = {
          item: value
        }
        try {
          // 從官方商店進貨
          if (is_official == 0) {
            await addOrUpdateUser(interaction)

            // 判斷是否有此商品
            const officialProduct = await OfficialProduct.findOne({
              roleId: args['item']
            })

            if (!officialProduct) {
              await interaction.editReply({
                embeds: [replyEmbed("官方商店無此商品")],
                components: [],
              }).then(() => console.log("Reply sent."))
                .catch(console.error)
              return
            }

            // 判斷商品數量是否大於進貨數量
            if (1 > officialProduct.amount) {
              await interaction.editReply({
                embeds: [replyEmbed("進貨數量大於此商品數量")],
                components: [],
              }).then(() => console.log("Reply sent."))
                .catch(console.error)
              return
            }

            // 判斷使用者帳戶是否足夠購買進貨數量的金額
            const point = await ServerPoint.findOne({
              serverId: interaction.guildId,
              userDiscordId: interaction.user.id,
            })

            if (!point) {
              await interaction.editReply({
                embeds: [replyEmbed("進貨總金額大於我的餘額")],
                components: [],
              }).then(() => console.log("Reply sent."))
                .catch(console.error)
              return
            }

            if (1 * officialProduct.price > point?.totalPoints) {
              await interaction.editReply({
                embeds: [replyEmbed("進貨總金額大於我的餘額")],
                components: [],
              }).then(() => console.log("Reply sent."))
                .catch(console.error)
              return
            }

            // 進貨
            // 1 扣掉金額
            // 2 扣除官方商店商品數量
            // 3. 新增 product
            await updateServerPoints({
              serverId: interaction.guildId,
              userDiscordId: interaction.user.id,
              point: -1 * 1 * officialProduct.price,
            })

            await updatePointAdjustLog({
              amount: -1 * 1 * officialProduct.price,
              serverId: interaction.guildId,
              userDiscordId: interaction.user.id,
              eventType: eventType.income_product,
            })

            officialProduct.amount = officialProduct.amount - 1
            await officialProduct.save()

            await Promise.all(_.range(1).map(async product => {
              try {
                const product = new Product({
                  created_at: Date(),
                  updated_at: Date(),
                  name: officialProduct.name,
                  roleId: args['item'],
                  price: 0,
                  serverId: interaction.guildId,
                  userId: interaction.user.id,
                  isOnShop: false,
                  isOnMarket: false,
                })
                await product.save()
              } catch (error) {
                console.log(error)
              }
            }))

            await interaction.editReply({
              embeds: [replyEmbed(`${officialProduct.name}` + `已進貨。可使用` + '`/my_item` 查看自己的背包')],
              components: [],
            }).then(() => console.log("Reply sent."))
              .catch(console.error)
            return
          }
          // 從個人商店或交易所購買商品
          await addOrUpdateUser(interaction)

          if (!ObjectId.isValid(args['item'])) {
            await interaction.editReply({
              embeds: [replyEmbed("商品id錯誤")],
              components: [],
            }).then(() => console.log("Reply sent."))
              .catch(console.error)
            return
          }

          // 判斷是否有此商品
          const product = await Product.findOne({
            _id: args['item'],
            isOnShop: true,
          })

          if (!product) {
            await interaction.editReply({
              embeds: [replyEmbed("查無此商品")],
              components: [],
            }).then(() => console.log("Reply sent."))
              .catch(console.error)
            return
          }

          // 判斷此商品為他人的商品並非自己的商品
          if (product.userId === interaction.user.id) {
            await interaction.editReply({
              embeds: [replyEmbed("此商品是你的，不用另外購買")],
              components: [],
            }).then(() => console.log("Reply sent."))
              .catch(console.error)
            return
          }

          // 判斷使用者帳戶是否足夠購買進貨數量的金額
          const point = await ServerPoint.findOne({
            serverId: interaction.guildId,
            userDiscordId: interaction.user.id,
          })

          if (!point) {
            await interaction.editReply({
              embeds: [replyEmbed("進貨總金額大於我的餘額")],
              components: [],
            }).then(() => console.log("Reply sent."))
              .catch(console.error)
            return
          }

          if (product.price > point?.totalPoints) {
            await interaction.editReply({
              embeds: [replyEmbed("商品金額大於我的餘額")],
              components: [],
            }).then(() => console.log("Reply sent."))
              .catch(console.error)
            return
          }

          const seller = await User.findOne({
            discordId: product.userId,
          })

          // 購買
          // 1 扣掉自己的金額
          // 2. 增加對方的金額
          // 3 轉移 product
          await updateServerPoints({
            serverId: interaction.guildId,
            userDiscordId: interaction.user.id,
            point: -1 * product.price,
          })

          await updatePointAdjustLog({
            amount: -1 * product.price,
            serverId: interaction.guildId,
            userDiscordId: interaction.user.id,
            eventType: eventType.buy_product,
          })

          await updateServerPoints({
            serverId: interaction.guildId,
            userDiscordId: seller.discordId,
            point: 1 * product.price,
          })

          await updatePointAdjustLog({
            amount: 1 * product.price,
            serverId: interaction.guildId,
            userDiscordId: seller.discordId,
            eventType: eventType.sell_product,
          })

          product.price = 0
          product.isOnShop = false
          product.isOnMarket = false
          product.userId = interaction.user.id
          await product.save()
          await interaction.editReply({
            embeds: [replyEmbed(`${product.name}` + ` 購買成功！可使用` + '`/my_item` 查看自己的背包')],
            components: [],
          }).then(() => console.log("Reply sent."))
            .catch(console.error)
          return
        } catch (error) {
          console.log(error)
        }
      }


    })


    // try {
    //   await interaction
    //     .reply({ embeds: [embed], ephemeral: true })

    // } catch (e) {
    //   console.log(e)
    // }
  },

  bagMsg: async ({ interaction, user_name, products }) => {
    const bag_name = '我的背包'
    const bag_hint = '指令說明：\n `/use [商品id]` 使用商品\n `/put_product [商品id]` 上架商品到自己的商店'
    const products_list_text = products.map(product => `${product.name} ` + '商品id: ' + '`' + product.id + '`' + '\n').join('\n')
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`${bag_name}`)
      .setDescription(
        "**" + user_name + "**" + bag_hint + '\n\n' +
        products_list_text
      )


    try {
      await interaction
        .reply({ embeds: [embed], ephemeral: true })
        .then(() => console.log("Reply sent."))
        .catch(console.error)
    } catch (e) {
      console.log(e)
    }
  },
}
