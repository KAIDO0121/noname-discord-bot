require("dotenv").config()
const fs = require('fs-extra')
const { User } = require("../../schema/user")
const { Wallet } = require("../../schema/wallet");
const { updateServerPoints } = require("../../crud/updateServerPoints")
const { updatePointAdjustLog } = require("../../crud/updatePointAdjustLog")
const mongoose = require("mongoose")

const noNameServerId = '930371558453694484'

const readJsonFile = async () => {
  let mongo_db_uri = process.env.NODE_ENV == 'production' ? process.env.MONGO_DB_URI_PRD : process.env.MONGO_DB_URI_DEV
  await mongoose.connect(mongo_db_uri)
  let unknown_point = await fs.readJson(__dirname + '/unknown_point.json')
  const invite = await fs.readJson(__dirname + '/invite.json')
  Object.keys(invite).map(key => {
    invite[key] = invite[key] * 5
  })
  const address = await fs.readJson(__dirname + '/address.json')
  let wallet_connected = await fs.readJson(__dirname + '/wallet_connected.json')
  Object.keys(wallet_connected).map(key => {
    wallet_connected[key] = 50
  })

  unknown_point = {
    ...unknown_point,
    ...wallet_connected,
    ...invite,
  }
  // 需要加上 invite 跟 mee6 level 的分數
  const user_list = Object.keys(unknown_point).map(id => {
    const id_from_address_data = Object.keys(address).map(address_with_name => ({
      id: address_with_name.slice(0, 18),
      name: address_with_name.slice(18),
      address: address[address_with_name]
    }))
    let walletAddress = []
    let discordName = ''
    if (id_from_address_data.find(address_with_name => address_with_name.id === id)) {
      walletAddress = [id_from_address_data.find(address_with_name => address_with_name.id === id).address]
    }

    if (id_from_address_data.find(address_with_name => address_with_name.id === id)) {
      discordName = id_from_address_data.find(address_with_name => address_with_name.id === id).name
    }

    return {
      discordId: id,
      createdAt: Date(),
      updatedAt: Date(),
      discordName,
      twitterAccount: '',
      twitterName: '',
      serverIds: [noNameServerId],
      walletAddress: {
        [noNameServerId]: walletAddress || []
      },
      mee6Level: {
        [noNameServerId]: 1,
      },
      invites: {
        [noNameServerId]: invite[id] / 5 || 0,
      },
      point: unknown_point[id] + invite[id],
    }
  })
  console.log(user_list)

  await Promise.all(
    user_list.map(async user => {
      console.log(user.discordId)
      try {
        const old_user = await User.findOne({
          discordId: user.discordId,
        })
        if (!old_user) {
          const newUser = new User({
            discordId: user.discordId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            discordName: user.discordName,
            twitterAccount: user.twitterAccount,
            twitterName: user.twitterName,
            serverIds: user.serverIds,
            walletAddress: user.walletAddress,
            mee6Level: user.mee6Level,
            invites: user.invites,
          })
          await newUser.save()
          // add point log and point
          await updateServerPoints({
            serverId: noNameServerId,
            userDiscordId: user.discordId,
            point: user.point,
          })

          await updatePointAdjustLog({
            serverId: noNameServerId,
            amount: user.point,
            userDiscordId: user.discordId,
            eventType: 'server_transfer',
          })
        } else {
          if (old_user?.serverIds?.includes(noNameServerId)) {
            old_user.discordId = user.discordId
            old_user.createdAt = user.createdAt
            old_user.updatedAt = user.updatedAt
            old_user.discordName = user.discordName
            old_user.twitterAccount = user.twitterAccount
            old_user.twitterName = user.twitterName
            old_user.walletAddress = user.walletAddress
            old_user.mee6Level = user.mee6Level
            old_user.invites = user.invites
            await old_user.save()
          } else {
            // user didn't has serverId
            old_user.discordId = user.discordId
            old_user.createdAt = user.createdAt
            old_user.updatedAt = user.updatedAt
            old_user.discordName = user.discordName
            old_user.twitterAccount = user.twitterAccount
            old_user.twitterName = user.twitterName
            user.serverIds.push(noNameServerId)
            old_user.walletAddress = user.walletAddress
            old_user.mee6Level = user.mee6Level
            old_user.invites = user.invites
            await old_user.save()
          }
        }

        if (user.walletAddress[noNameServerId].length > 0) {
          const old_wallet = await Wallet.findOne({
            discordId: user.discordId,
          })
          if (!old_wallet) {
            const w = new Wallet({
              discordName: user.discordName,
              discordId: user.discordId,
              walletAddress: user.walletAddress[noNameServerId][0],
            });
            await w.save();
          } else {
            old_wallet.discordName = user.discordName
            old_wallet.discordId = user.discordId
            old_wallet.walletAddress = user.walletAddress[noNameServerId][0]
            await old_wallet.save();
          }
        }
      } catch (e) {
        console.log(e)
      }
    })
  )
}

readJsonFile()