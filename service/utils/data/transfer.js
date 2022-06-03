require("dotenv").config()
const fs = require('fs-extra')
const { User } = require("../../schema/user")
const { updateServerPoints } = require("../../crud/updateServerPoints")
const { updatePointAdjustLog } = require("../../crud/updatePointAdjustLog")
const mongoose = require("mongoose")

const readJsonFile = async () => {
  let mongo_db_uri = process.env.NODE_ENV == 'production' ? process.env.MONGO_DB_URI_PRD : process.env.MONGO_DB_URI_DEV
  await mongoose.connect(mongo_db_uri)
  let unknown_point = await fs.readJson(__dirname + '/unknown_point.json')
  const invite = await fs.readJson(__dirname + '/invite.json')
  const address = await fs.readJson(__dirname + '/address.json')
  let wallet_connected = await fs.readJson(__dirname + '/wallet_connected.json')
  Object.keys(wallet_connected).map(key => {
    wallet_connected[key] = 50
  })

  unknown_point = {
    ...unknown_point,
    ...wallet_connected,
  }
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
      serverIds: ['930371558453694484'],
      walletAddress: {
        '930371558453694484': walletAddress || []
      },
      mee6Level: {
        '930371558453694484': 1,
      },
      invites: {
        '930371558453694484': invite[id] || 0,
      },
      point: unknown_point[id],
    }
  })
  // console.log(user_list)

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
            serverId: '930371558453694484',
            userDiscordId: user.discordId,
            point: user.point,
          })

          await updatePointAdjustLog({
            serverId: '930371558453694484',
            amount: user.point,
            userDiscordId: user.discordId,
            eventType: 'server_transfer',
          })
        } else {
          if (old_user?.serverIds?.includes('930371558453694484')) {
            user.discordId = user.discordId
            user.createdAt = user.createdAt
            user.updatedAt = user.updatedAt
            user.discordName = user.discordName
            user.twitterAccount = user.twitterAccount
            user.twitterName = user.twitterName
            user.walletAddress = user.walletAddress
            user.mee6Level = user.mee6Level
            user.invites = user.invites
            await old_user.save()
          } else {
            // user didn't has serverId
            user.discordId = user.discordId
            user.createdAt = user.createdAt
            user.updatedAt = user.updatedAt
            user.discordName = user.discordName
            user.twitterAccount = user.twitterAccount
            user.twitterName = user.twitterName
            user.serverIds.push('930371558453694484')
            user.walletAddress = user.walletAddress
            user.mee6Level = user.mee6Level
            user.invites = user.invites
            await old_user.save()
          }
        }
      } catch (e) {
        console.log(e)
      }
    })
  )
}

readJsonFile()