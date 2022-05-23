// TODO 各伺服器自定義的eventType typeToPoint eventPoint要存在資料庫

const eventType = {
  self_introduce: "self_introduce",
  fanart: "fanart",
  contest: "contest",
  active_user: "active_user",
  best_answer: "best_answer",
  advisor: "advisor",
  invite: "invite",
  add_wallet: "add_wallet",
  remove_wallet: "remove_wallet",
  mee6: "mee6",
};
const typeToPoint = {
  self_introduce: 10,
  fanart: 100,
  contest: 500,
  active_user: 100,
  best_answer: 200,
  advisor: 87,
  invite: 5,
  add_wallet: 50,
  remove_wallet: -50,
  mee6: 6,
};
const eventPoint = [
  {
    name: "self_introduce",
    value: eventType.self_introduce,
  },
  {
    name: "fanart",
    value: eventType.fanart,
  },
  {
    name: "contest",
    value: eventType.contest,
  },
  {
    name: "active_user",
    value: eventType.active_user,
  },
  {
    name: "best_answer",
    value: eventType.best_answer,
  },
  {
    name: "invite",
    value: eventType.invite,
  },
  {
    name: "advisor",
    value: eventType.advisor,
  },
  {
    name: "mee6",
    value: eventType.mee6,
  },
  {
    name: "add_wallet",
    value: eventType.add_wallet,
  },
  {
    name: "remove_wallet",
    value: eventType.remove_wallet,
  },
];

const noNameServerId = "968131609163358259";

module.exports = {
  eventType,
  typeToPoint,
  eventPoint,
  noNameServerId,
};

// 自我介紹, 二創, ⽐賽活動, 群內活躍, 疑難雜症解答, 提供建議, 邀請人數, 綁定錢包, Mee6 等級

// Application Command Option Type
// name	VALUE	NOTE
// SUB_COMMAND	1
// SUB_COMMAND_GROUP	2
// STRING	3
// INTEGER	4	Any integer between -2^53 and 2^53
// BOOLEAN	5
// USER	6
// CHANNEL	7	Includes all channel types + categories
// ROLE	8
// MENTIONABLE	9	Includes users and roles
// NUMBER	10	Any double between -2^53 and 2^53
// ATTACHMENT	11	attachment object
