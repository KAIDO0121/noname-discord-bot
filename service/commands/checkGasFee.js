const { error, multiFieldsMsg } = require("../utils/msgTemplate");
const { creditMinus1, getCurrentCredit } = require("../utils/gasFeeAPICounter")
require("dotenv").config()
const axios = require('axios');

// each time this function invoked, credit -= 1
// timer start
// 
module.exports = {
  name: "check_gas_fee",
  description: "Check current gas fee of ethereum",
  run: async (client, interaction, args) => {

    try {
      if (getCurrentCredit() < 1) {
        return error({
          msg: `此指令已達使用次數上限, 請稍待1小時`,
          interaction,
        });
      }
      const res = await axios.get(`https://owlracle.info/eth/gas?apikey=${process.env.GAS_FEE_TRACKER_API_KEY}&percentile=0.3&accept=35%2C60%2C90%2C100`)
      creditMinus1()

      const gasFeeName = ['standard', 'fast', 'instant']
      let gasFees = gasFeeName.map((name, i) => ({
        name: name,
        value: `Base : ${res.data.speeds[i + 1].gasPrice} GWei \n Tip: ${res.data.speeds[i + 1].gasPrice - res.data.baseFee} GWei`,
        inline: true,
      }));

      gasFees.push({
        name: 'slow',
        value: `Base : ${res.data.baseFee} GWei \n Tip: 0 GWei`,
        inline: true,
      })
      return multiFieldsMsg({
        msgFields: gasFees,
        interaction,
      });
    } catch (error) {
      console.log(error)
    }


  },
};
