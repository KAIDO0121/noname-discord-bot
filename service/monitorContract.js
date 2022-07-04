const { error, multiFieldsMsg, success } = require("./utils/msgTemplate");

module.exports = {
  name: "check_gas_fee",
  description: "Check current gas fee of ethereum",
  run: async (client, interaction, args) => {


    return multiFieldsMsg({
      msgFields: address,
      interaction,
    });
  },
};
