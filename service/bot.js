require("dotenv").config();
const { Wallet } = require("./schema/wallet");
const { eventPoint, typeToPoint, noNameServerId } = require("./config");
const { resetCredit } = require("./utils/gasFeeAPICounter")
const mongoose = require("mongoose");
const { botReady } = require("./event/botReady");
const express = require("express");
const multer = require("multer");
const upload = multer();
const app = express();

app.get("/", async function (req, res) {
  res.send("root");
});

app.post("/adminLogs", upload.array(), async (req, res) => {
  try {
    const wallet = await Wallet.aggregate([
      {
        $lookup: {
          from: "serverpoints",
          let: {
            usersTableDiscordId: "$discordId",
            usersTableServerId: noNameServerId,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$userDiscordId", "$$usersTableDiscordId"],
                    },
                    { $eq: ["$serverId", "$$usersTableServerId"] },
                  ],
                },
              },
            },
          ],
          as: "totalPointData",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "discordId",
          foreignField: "discordId",
          as: "users",
        },
      },
      {
        $project: {
          _id: 0,
          discordName: 1,
          walletAddress: 1,
          mee6Level: `$users.mee6Level.${noNameServerId}`,
          invites: `$users.invites.${noNameServerId}`,
          walletLength: `$users.walletAddress.${noNameServerId}`,
          "totalPointData.totalPoints": 1,
        },
      },
    ]);
    let responses = {};
    wallet.forEach((el) => {
      let entity = {};
      entity["Discord name"] = el.discordName;
      entity["Discord invite UP"] = (el?.invites?.[0] ?? 0) * typeToPoint.invite;

      if (el?.walletLength?.[0]?.length > 0) {
        entity["wallet connected UP"] = el?.walletLength?.[0].includes(el.walletAddress) ? 50 : 0
        entity["general UP"] = el?.walletLength?.[0].includes(el.walletAddress) ?
          (el?.totalPointData?.[0]?.totalPoints - entity["wallet connected UP"] - entity["Discord invite UP"] - Math.floor((el?.mee6Level?.[0] ?? 0) / 5) * typeToPoint.mee6) : 0
      } else {
        entity["wallet connected UP"] = 0
        entity["general UP"] = 0
      }

      entity["Mee6 level UP"] = Math.floor((el?.mee6Level?.[0] ?? 0) / 5) * typeToPoint.mee6;
      responses[el.walletAddress] = entity;
    });

    if (req?.body?.address) {
      responses = Object.fromEntries(
        Object.entries(responses).filter(([key]) =>
          key.includes(req.body.address)
        )
      );
    }

    res.send(responses);
  } catch (error) {
    console.log(error);
  }
});

async function main() {
  setInterval(() => {
    resetCredit()
  }, 3600000);
  try {
    let mongo_db_uri = process.env.NODE_ENV == 'production' ? process.env.MONGO_DB_URI_PRD : process.env.MONGO_DB_URI_DEV;
    await mongoose.connect(mongo_db_uri);
  } catch (error) {
    console.error(error);
  }
}
main();
botReady();
app.listen(3000);
