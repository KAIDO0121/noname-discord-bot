require("dotenv").config();
const { User } = require("./schema/user");
const { eventPoint, typeToPoint, noNameServerId } = require("./config");
const mongoose = require("mongoose");
const { botReady } = require("./event/botReady");
const express = require("express");
const app = express();

app.get("/adminLogs", async function (req, res) {
  try {
    const users = await User.aggregate([
      {
        $match: { serverIds: noNameServerId },
      },
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
        $project: {
          discordName: 1,
          walletAddress: `$walletAddress.${noNameServerId}`,
          invitePoints: { $multiply: [`$invites.${noNameServerId}`, 5] },
          "totalPointData.totalPoints": 1,
        },
      },
    ]);

    res.send(users);
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
