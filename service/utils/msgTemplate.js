const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

module.exports = {
  error: async ({ msg, title = "Error", interaction }) => {
    const embed = new MessageEmbed()
      .setColor("#FF5733")
      .setTitle(title)
      .setDescription(msg)

    await interaction
      .reply({ embeds: [embed], ephemeral: true })
      .then(() => console.log("Reply sent."))
      .catch(console.error)
  },
  success: async ({ msg, title = "Success", interaction }) => {
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(title)
      .setDescription(msg)

    await interaction
      .reply({ embeds: [embed], ephemeral: true })
      .then(() => console.log("Reply sent."))
      .catch(console.error)
  },
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

  shopMsg: async ({ interaction, is_official = false, user_name, productChunk, hint }) => {
    const shop_name = is_official ? '官方商店' : `${user_name}的商店`
    let shop_hint
    if (hint) {
      shop_hint = hint
    } else {
      shop_hint = is_official ? '你可以使用 `/income_product [商品id] [數量]` 來進貨商品 \n\n' : '你可以使用 `/put_product [商品id]` 上架商品到自己的商店 \n\n'
    }

    const embeds = []
    productChunk.forEach((products, index) => {
      const products_list_text = products.map(product => `${product.name} | 價格：${product.price} :coin: | 目前數量：${product.amount}
    ` + '商品id: ' + '`' + product.id + '`' + '\n').join('\n')
      embeds.push(new MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`${shop_name} - Page ${index + 1}/${productChunk.length}`)
        .setDescription(
          "**" + user_name + "**" + shop_hint +
          products_list_text
        ))
    })

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
    let collector
    const filter = (i) => i.user.id === interaction.user.id
    const time = 1000 * 60 * 1
    const embed = embeds[pages[id]]
    await interaction
      .reply({
        embeds: [embed],
        components: [getRow(id)],
        ephemeral: true
      }).then(() => console.log("Reply sent."))
      .catch(console.error)
      const reply = await interaction.fetchReply();

    collector = await reply.createMessageComponentCollector({ filter, time })

    collector.on('collect', async (btnInt) => {
      if (!btnInt) {
        return
      }

      btnInt.deferUpdate()

      if (btnInt.customId !== `prev_shop` && btnInt.customId !== `next_shop`) {
        return
      }

      if (btnInt.customId === `prev_shop` && pages[id] > 0) {
        --pages[id]
      } else if (btnInt.customId === `next_shop` && pages[id] < embeds.length - 1) {
        ++pages[id]
      }

      await interaction.editReply({
        embeds: [embeds[pages[id]]],
        components: [getRow(id)],
      }).then(() => console.log("Reply sent."))
        .catch(console.error)
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
