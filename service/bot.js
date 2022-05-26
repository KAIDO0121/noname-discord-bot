require("dotenv").config();
const { Wallet } = require("./schema/wallet");
const { eventPoint, typeToPoint, noNameServerId } = require("./config");
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
      entity["Discord invite UP"] = el?.invites?.[0] * typeToPoint.invite;

      entity["wallet connected UP"] =
        (el?.walletLength?.[0].length ?? 0) * typeToPoint.add_wallet;

      entity["general UP"] =
        el?.totalPointData?.[0]?.totalPoints -
        (el?.walletLength?.[0].length ?? 0) * typeToPoint.add_wallet -
        (el?.invites?.[0] ?? 0) * typeToPoint.invite;

      entity["Mee6 level UP"] = 0;
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
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
  } catch (error) {
    console.error(error);
  }
}
main();
botReady();
app.listen(3000);
